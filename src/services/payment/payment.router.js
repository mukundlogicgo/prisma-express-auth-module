import express from "express";
import { multerUpload } from "../../config/defaultValues.config.js";
import { createPaymentIntent } from "./payment.controller.js";

const router = express.Router();

// full route  /api/payment

router.get("/", multerUpload.none(), async (req, res) =>
  res.status(200).json({ message: "path GET /api/payment" })
);

router.post("/create-intent", multerUpload.none(), createPaymentIntent);

export default router;
