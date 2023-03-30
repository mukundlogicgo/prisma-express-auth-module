import { googleClient } from "./auth.config.js";
import { generateToken } from "./helper/generateToken.helper.js";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../../config/defaultValues.config.js";
import { registerUserSchema } from "./auth.validator.js";
import z from "zod";
import { formatZodError } from "./helper/formatZodError.js";

export const signInWithGoogle = async (req, res) => {
  try {
    // get token from headers
    const access_token = req.headers.authorization.split(" ")[1];

    // check access token is required
    if (!access_token || !access_token?.trim()) {
      return res.status(401).json({
        message: "Invalid credential",
      });
    }

    let data;
    try {
      // get id token from access token
      const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;
      const axiosRes = await axios.get(url);
      data = axiosRes.data;
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Invalid credential",
      });
    }

    // get user info from token
    const {
      name,
      email,
      picture: profilePicture,
      email_verified: emailVerified,
      sub: providerId,
    } = data;

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
    });

    // sanitize user password
    delete user.password;

    // create jwt token for auth
    const token = await generateToken({
      userId: user.id,
    });

    // send 200 response
    return res.status(200).json({
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
    // validate incoming user data
    const { name, email, password, profilePicture } =
      await registerUserSchema.parse(req.body);

    // check user already not exist
    const existUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // send 409 conflict response if user exist
    if (existUser) {
      return res.status(409).json({
        message: "Email id or user name already taken.",
      });
    }

    // encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 12);

    // create user to db
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

    // generate token
    const token = await generateToken({ userId: user.id });

    // send 200 response
    res.status(201).json({
      message: "User register successfully",
      data: user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // format zod error
      const formattedError = await formatZodError({ error });

      // send 400 response
      return res.status(400).json({
        error: formattedError,
      });
    }
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
    const passwordMatch = await bcrypt.compare(password, existUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: `Invalid credentials`,
      });
    }

    // generate token
    const token = await generateToken({ userId: existUser.id });

    // sanitize user password
    delete existUser.password;

    // send 200 response
    res.status(200).json({
      message: "User logged in successfully",
      data: existUser,
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
