// backend/controllers/resourceController.js
import Resource from "../models/Resource.js";
import Community from "../models/Community.js";

/**
 * POST /api/v1/resources
 * Accepts multipart/form-data: file (optional), title, description, externalLink (optional), community (optional)
 */
export const shareResource = async (req, res) => {
  try {
    const file = req.file;
    const { title = "", description = "", externalLink = "", community = null } = req.body;

    // If community provided, ensure exists (but not required)
    if (community) {
      const comm = await Community.findById(community);
      if (!comm) return res.status(404).json({ error: "Community not found" });
      // optionally check membership etc. (we'll allow sharing inside community only by members)
      if (!comm.members.includes(req.user._id)) {
        return res.status(403).json({ error: "You must be a member to share in this community" });
      }
    }

    const fileUrl = file ? `/uploads/resources/${file.filename}` : "";
    const fileType = file ? (file.mimetype && file.mimetype.startsWith("video") ? "video" : "image") : "none";

    const doc = await Resource.create({
      user: req.user._id,
      title,
      description,
      community: community || null,
      fileUrl,
      fileType,
      externalLink: externalLink || ""
    });

    const populated = await Resource.findById(doc._id).populate("user", "username email");
    res.status(201).json({ message: "Resource shared", resource: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/v1/resources
 * Global feed (all resources). Optionally ?community=<id> to fetch only community resources
 */
export const getResources = async (req, res) => {
  try {
    const { community } = req.query;
    const filter = {};

    if (community) {
      filter.community = community;
    }

    const resources = await Resource.find(filter)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json({ resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


