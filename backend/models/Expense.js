import mongoose, { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    }, // Optional, for shared expenses
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Fixed",
        "Group Expenses",
        "Food&Drinks",
        "Entertainment",
        "Subscriptions",
        "Others",
      ],
    },
    transactionDate: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "one-time"],
      default: "one-time",
    },
    notes: { type: String, default: "" },

    attachments: [
      {
        fileName: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ], // Optional attachments (e.g., receipts)
  },
  { timestamps: true }
);

export default model("Expense", expenseSchema);
