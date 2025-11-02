// backend/models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    // optional association to community (if shared inside a community)
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", default: null },
    fileUrl: { type: String, default: "" }, // local path e.g. /uploads/resources/...
    fileType: { type: String, enum: ["image", "video", "none"], default: "none" },
    externalLink: { type: String, default: "" } // if user shares link instead of upload
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
