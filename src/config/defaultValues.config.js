import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

// config multer
export const multerUpload = multer();

// export env variables
export const {
  SERVER_BASE_URL,
  PORT,

  REDIRECT_URL,

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,

  JWT_SECRET,

  STRIPE_SECRET_KEY,
} = process.env;

export const prisma = new PrismaClient();
