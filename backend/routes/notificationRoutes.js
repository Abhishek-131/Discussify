import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// 🔹 Get logged-in user's notifications
router.get("/", protect, getNotifications);

// 🔹 Mark single notification as read
router.put("/:id/read", protect, markAsRead);

// 🔹 Clear all notifications
router.delete("/clear", protect, clearNotifications);

export default router;
