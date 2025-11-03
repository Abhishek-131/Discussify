import Discussion from "../models/Discussion.js";
import Community from "../models/Community.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";

// GET /api/v1/users/me/activity
export const getMyActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = [];

    // 🗣️ Discussions created
    const discussions = await Discussion.find({ author: userId })
      .populate("community", "name")
      .sort({ createdAt: -1 });
    discussions.forEach((d) =>
      activities.push({
        type: "discussion",
        message: `Created discussion "${d.title}" in ${d.community?.name}`,
        createdAt: d.createdAt,
      })
    );

    // 👥 Communities joined
    const joined = await Community.find({ members: { $in: [userId] } })
      .select("name createdAt");
    joined.forEach((c) =>
      activities.push({
        type: "join",
        message: `Joined community "${c.name}"`,
        createdAt: c.createdAt,
      })
    );

    // 📎 Resources shared
    const resources = await Resource.find({ user: userId })
      .populate("community", "name")
      .sort({ createdAt: -1 });
    resources.forEach((r) =>
      activities.push({
        type: "resource",
        message: `Shared ${r.type === "video" ? "video" : "article"} "${r.title}" in ${r.community?.name}`,
        createdAt: r.createdAt,
      })
    );

    // 💬 Comments added
    const userDiscussions = await Discussion.find({ "comments.author": userId })
      .populate("community", "name")
      .select("title comments createdAt");
    userDiscussions.forEach((d) =>
      d.comments
        .filter((c) => c.author.toString() === userId.toString())
        .forEach((c) =>
          activities.push({
            type: "comment",
            message: `Commented on "${d.title}" discussion`,
            createdAt: c.createdAt,
          })
        )
    );

    // Sort by latest
    activities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ activities });
  } catch (err) {
    console.error("Activity fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};
