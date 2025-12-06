import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/profile", protect, updateUserProfile);
router.get("/me", getCurrentUser);

export default router;
