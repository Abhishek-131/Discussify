import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyActivity } from "../controllers/userActivityController.js";

const router = express.Router();

router.get("/me/activity", protect, getMyActivity);

export default router;
