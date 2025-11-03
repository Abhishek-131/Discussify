// backend/controllers/resourceController.js
import Resource from "../models/Resource.js";
import Community from "../models/Community.js";
import Notification from "../models/Notification.js";

// POST /api/v1/resources/:communityId
export const shareResource = async (req, res) => {
  try {
    const { title, description, type, link, fileUrl } = req.body;
    const communityId = req.params.communityId;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });

    // Only members can share
    if (!community.members.some((m) => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: "You must be a member to share resources" });
    }

    const resource = await Resource.create({
      title,
      description,
      type,
      link,
      fileUrl,
      community: communityId,
      sharedBy: req.user._id,
    });

    // ✅ Create notifications for other community members
    const otherMembers = community.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );

    const message = `📎 New resource "${title}" shared in "${community.name}"`;
    const linkTo = `/communities/${communityId}/resources`;

    const notifications = otherMembers.map((userId) => ({
      user: userId,
      message,
      link: linkTo,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Resource shared successfully", resource });
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


