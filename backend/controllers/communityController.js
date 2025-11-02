import Community from "../models/Community.js";
import User from "../models/User.js";

// 🟢 Create Community
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Community name is required" });

    const existing = await Community.findOne({ name });
    if (existing) return res.status(400).json({ error: "Community name already exists" });

    const community = await Community.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({ message: "Community created successfully", community });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get all communities joined by the user
export const getMyCommunities = async (req, res) => {
  try {
    const communities = await Community.find({
      members: { $in: [req.user._id] },
    })
      .populate("creator", "email")
      .sort({ createdAt: -1 });

    res.json({ communities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Edit community details
export const editCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });
    if (!community.creator.equals(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    community.name = name || community.name;
    community.description = description || community.description;
    await community.save();

    res.json({ message: "Community updated successfully", community });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Invite (add) member instantly by email
export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (community.members.includes(user._id)) {
      return res.status(400).json({ error: "User already a member" });
    }

    community.members.push(user._id);
    await community.save();

    res.json({ message: "User invited (added) successfully", community });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Join a community
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });

    const userId = req.user._id;
    if (community.members.includes(userId)) {
      return res.status(400).json({ error: "Already a member" });
    }

    community.members.push(userId);
    await community.save();

    res.json({ message: "Joined community successfully", community });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 List all public communities (search optional)
export const listPublicCommunities = async (req, res) => {
  try {
    const q = (req.query.search || "").trim();
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const communities = await Community.find(filter)
      .select("name description creator members")
      .populate("creator", "email");

    res.json({ communities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
