// backend/routes/resourceRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResource } from "../middleware/uploadResource.js";
import { shareResource, getResources } from "../controllers/resourceController.js";

const router = express.Router();

/**
 * POST /api/v1/resources
 * multipart: file, form fields: title, description, externalLink, community (optional)
 */
router.post("/", protect, uploadResource.single("file"), shareResource);

// GET /api/v1/resources  (optionally: ?community=<id>)
router.get("/", protect, getResources);

export default router;
