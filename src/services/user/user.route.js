import express from "express";
import { getUserProfile } from "./user.controller.js";

const router = express.Router();

// full route /api/user
router.get("/profile", getUserProfile);

export default router;
