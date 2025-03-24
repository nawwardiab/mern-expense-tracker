import mongoose, { Schema, model } from "mongoose";

const paymentSchema = new Schema(
    {
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
        payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true, min: 0.01 }, // Prevents zero payments
        currency: { type: String, default: "EUR" }, // Supports multiple currencies
        paymentMethod: { 
            type: String, 
            enum: ["cash", "bank_transfer", "stripe", "paypal"], 
            default: "cash" 
        },
        //transactionId: { type: String, default: "" }, // For external payment tracking
        status: { 
            type: String, 
            enum: ["pending", "completed", "failed"], 
            default: "pending" 
        },
        notes: { type: String, default: "" }, // Optional payment notes
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default model("Payment", paymentSchema);
