import mongoose, { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    members: [
      {
        groupMember: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    totalAmount: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Group", groupSchema);
