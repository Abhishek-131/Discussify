import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
} from "../controllers/adminController.js";

const router = express.Router();

// protect middleware ensures only logged in users
// you can add role-based check here
router.get("/stats", protect, getAdminStats);
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
router.get("/communities", protect, getAllCommunities);
router.put("/communities/:id", protect, updateCommunity);
router.delete("/communities/:id", protect, deleteCommunity);

export default router;
