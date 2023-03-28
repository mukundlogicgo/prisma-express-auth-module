import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../config/defaultValues.config.js";

export const generateToken = async ({ userId, expiresIn = "7d" }) => {
  return await jwt.sign({ userId }, JWT_SECRET, {
    expiresIn,
  });
};
