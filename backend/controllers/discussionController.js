import Discussion from "../models/Discussion.js";
import Community from "../models/Community.js";

// 🟢 Create a discussion
export const createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "Title and content are required" });

    const communityId = req.params.communityId;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });

    // Only members can post
    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ error: "You must be a member to post" });
    }

    const discussion = await Discussion.create({
      community: communityId,
      title,
      content,
      author: req.user._id,
    });

    const populated = await Discussion.findById(discussion._id).populate(
      "author",
      "email username"
    );

    res.status(201).json({ message: "Discussion created", discussion: populated });
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
