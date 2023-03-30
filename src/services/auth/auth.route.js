import express from "express";
import { multerUpload } from "../../config/defaultValues.config.js";
import {
  loginWithEmail,
  registerWithEmail,
  signInWithGoogle,
} from "./auth.controller.js";

const router = express.Router();

// full route  /api/auth

router.get("/google", multerUpload.none(), signInWithGoogle);

router.post("/register", multerUpload.none(), registerWithEmail);
router.post("/login", multerUpload.none(), loginWithEmail);

export default router;
