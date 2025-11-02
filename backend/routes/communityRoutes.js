import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCommunity,
  getMyCommunities,
  editCommunity,
  inviteMember
} from "../controllers/communityController.js";
import { listPublicCommunities, joinCommunity, /* ...existing... */ } from "../controllers/communityController.js";

const router = express.Router();

router.post("/", protect, createCommunity);
router.get("/my", protect, getMyCommunities);
router.put("/:id", protect, editCommunity);
router.post("/:id/invite", protect, inviteMember);

router.get("/public", listPublicCommunities);
router.post("/:id/join", protect, joinCommunity);


export default router;
