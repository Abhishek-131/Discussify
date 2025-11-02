import User from "../models/User.js";
import Community from "../models/Community.js";
import Resource from "../models/Resource.js"; // assuming you already have this model

// =============================
// Dashboard Stats
// =============================
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCommunities = await Community.countDocuments();
    const totalResources = await Resource.countDocuments();

    res.json({ totalUsers, totalCommunities, totalResources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Get All Users
// =============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role createdAt");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Update User (Edit)
// =============================
export const updateUser = async (req, res) => {
  try {
        console.log("Incoming PUT /admin/users/:id", req.params.id, req.body); // 👈 Add this line

    const { username, bio } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.username = username || user.username;
    user.bio = bio || user.bio;
    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Delete User
// =============================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Get All Communities
// =============================
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("creator", "username email")
      .select("name description members createdAt isPrivate");
    res.json({ communities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Update Community
// =============================
export const updateCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });

    community.name = name || community.name;
    community.description = description || community.description;
    await community.save();

    res.json({ message: "Community updated successfully", community });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Delete Community
// =============================
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
