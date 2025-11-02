import User from "../models/User.js";

// GET /api/v1/profile/me
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ user });
};

// PUT /api/v1/profile
export const updateProfile = async (req, res) => {
  const { username, bio } = req.body;

  if (!username && !bio) {
    return res.status(400).json({ error: "No data to update" });
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { username, bio },
    { new: true }
  ).select("-password");

  res.status(200).json({ message: "Profile updated successfully", user: updated });
};

// POST /api/v1/profile/picture
export const uploadProfilePicture = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imagePath = `/uploads/avatars/${req.file.filename}`;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: imagePath },
    { new: true }
  ).select("-password");

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    user: updatedUser
  });
};
