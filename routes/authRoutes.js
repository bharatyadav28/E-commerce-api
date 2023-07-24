import express from "express";

import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/logout", authentication, logout);

export default router;
