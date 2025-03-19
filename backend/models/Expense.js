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
    transactionDate: {
      type: Date,
      required: function () {
        return !this.isRecurring; // Only required if NOT recurring
      },
    },
    startDate: {
      type: Date,
      required: function () {
        return this.isRecurring; // Required ONLY for recurring expenses
      },
    },
    endDate: {
      type: Date,
      required: function () {
        return this.isRecurring; // Required ONLY for recurring expenses
      },
    },
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "one-time"], 
      required: function () {
        return this.isRecurring; // Must be present if recurring
      },
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

