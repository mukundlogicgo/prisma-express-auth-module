import express from "express";
import cors from "cors";
import authRouter from "./services/auth/auth.route.js";
import userRouter from "./services/user/user.route.js";
import { authenticate } from "./services/auth/auth.middleware.js";
import { PORT } from "./config/defaultValues.config.js";
import paymentRouter from "./services/payment/payment.router.js";

const port = PORT ?? 5000;

const app = express();

// cors middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// parse req to json middleware
app.use(express.json());

// get server health route
app.get("/api", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Server is running on: ${PORT}`,
  });
});

// auth router
app.use("/api/auth", authRouter);

// user router
app.use("/api/user", authenticate, userRouter);

// payment router
app.use("/api/payment", paymentRouter);

// home router
app.get("/", authenticate, (req, res) => {
  res.status(200).json({
    message: "hello this is home page",
  });
});

// start server
app.listen(port, () => {
  console.log(`Server running : ${port}`);
});
