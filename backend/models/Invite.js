import mongoose, { Schema, model } from "mongoose";

const inviteSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model("Invite", inviteSchema);
