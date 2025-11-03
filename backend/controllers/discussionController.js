import Discussion from "../models/Discussion.js";
import Community from "../models/Community.js";
import Notification from "../models/Notification.js"; // ✅ import

// POST /api/v1/discussions/:communityId
export const createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const communityId = req.params.communityId;

    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });

    // Only members can post
    if (!community.members.some((m) => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: "You must be a member to post" });
    }

    const discussion = await Discussion.create({
      community: communityId,
      title,
      content,
      author: req.user._id,
    });

    // ✅ Send notifications to all members except the creator
    const otherMembers = community.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );

    const message = `🗣️ New discussion "${title}" in "${community.name}"`;
    const link = `/communities/${communityId}/discussions/${discussion._id}`;

    const notifications = otherMembers.map((userId) => ({
      user: userId,
      message,
      link,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Discussion created", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get discussions for a community
export const getDiscussions = async (req, res) => {
  try {
    const { communityId } = req.params;
    const discussions = await Discussion.find({ community: communityId })
      .populate("author", "email username")
      .populate("comments.author", "email username")
      .sort({ createdAt: -1 });

    res.json({ discussions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Add a comment to a discussion
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Comment content required" });

    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) return res.status(404).json({ error: "Discussion not found" });

    const community = await Community.findById(discussion.community);
    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ error: "You must be a member to comment" });
    }

    discussion.comments.push({ author: req.user._id, content });
    await discussion.save();

    const updated = await Discussion.findById(discussion._id).populate(
      "comments.author",
      "email username"
    );

    res.json({ message: "Comment added", discussion: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
