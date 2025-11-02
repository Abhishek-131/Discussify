import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createDiscussion, getDiscussions, addComment } from "../controllers/discussionController.js";

const router = express.Router();

router.post("/:communityId", protect, createDiscussion);
router.get("/:communityId", protect, getDiscussions);
router.post("/comment/:discussionId", protect, addComment);

export default router;
