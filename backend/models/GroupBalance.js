import mongoose, { Schema, model } from "mongoose";

const groupBalanceSchema = new Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalContributed: {
      type: Number,
      default: 0,
    },
    totalOwed: {
      type: Number,
      default: 0,
    },
    // For quick lookups (totalContributed - totalOwed)
    netBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create a compound index for quick lookups
groupBalanceSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export default model("GroupBalance", groupBalanceSchema);
