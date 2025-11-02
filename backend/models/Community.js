import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending","accepted","rejected"], default: "pending" }
}, { _id: false });

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invites: [inviteSchema],
    isPrivate: { type: Boolean, default: false } // default public
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
