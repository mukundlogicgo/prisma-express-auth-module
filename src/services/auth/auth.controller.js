import { googleClient } from "./auth.config.js";
import { generateToken } from "./helper/generateToken.helper.js";
import bcrypt from "bcrypt";
import {
  prisma,
  GOOGLE_CLIENT_ID,
  REDIRECT_URL,
} from "../../config/defaultValues.config.js";

export const signInWithGoogle = async (req, res) => {
  try {
    const redirectUri = REDIRECT_URL;
    const scopes = ["profile", "email"];

    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      redirect_uri: redirectUri,
      prompt: "select_account",
    });

    return res.redirect(authUrl);
  } catch (error) {
    console.log("[ERROR]", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signInWithGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // get google token from req query
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: REDIRECT_URL,
    });

    // get user info from token
    const userInfo = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const {
      name,
      email,
      picture: profilePicture,
      email_verified: emailVerified,
      azp: providerId,
    } = userInfo.payload;

    // update user data if exist or register user
    const user = await prisma.user.upsert({
      create: {
        name,
        email,
        provider: "google",
        profilePicture,
        emailVerified,
        providerId,
      },

      update: {
        name,
        email,
        provider: "google",
        profilePicture,
        emailVerified,
        providerId,
      },
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        profilePicture: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // create jwt token for auth
    const token = await generateToken({
      userId: user.id,
    });

    // send 200 response
    res.status(200).json({
      message: "User sign in in successfully.",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerWithEmail = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    // check user not exist
    const existUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // send 409 conflict response
    if (existUser) {
      return res.status(409).json({
        message: "Email id or user name already taken.",
      });
    }

    // encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        provider: "email",
        profilePicture: profilePicture ?? "",
      },
    });

    // sanitize user password
    delete user.password;

    // send 200 response
    res.status(201).json({
      message: "User register successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    // send 500 response
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check email and password required

    // check user is exist
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (!existUser) {
      return res.status(401).json({
        message: `Invalid credentials`,
      });
    }
    // validate user password
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: `Invalid credentials`,
      });
    }

    // generate token
    const token = await generateToken({ userId: user.id });

    // sanitize user password
    delete user.password;

    // send 200 response
    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    // send 500 response
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
