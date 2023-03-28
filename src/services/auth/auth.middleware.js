import { JWT_SECRET } from "../../config/defaultValues.config.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  // get token from headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token is not valid or expired",
    });
  }

  try {
    const decodedToken = await jwt.verify(token, JWT_SECRET);

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).send("Token is not valid or expired");
  }
};
