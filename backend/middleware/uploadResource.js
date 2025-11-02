// backend/middleware/uploadResource.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/resources";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/quicktime"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and mp4/quicktime videos allowed"), false);
};

// set a higher limit for resources (videos)
export const uploadResource = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 80 MB
  fileFilter,
});
