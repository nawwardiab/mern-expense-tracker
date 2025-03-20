import mongoose, { Schema, model } from "mongoose";


const groupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["admin", "member"], default: "member" }
      }
    ],

    totalAmount: { type: Number, required: true, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }], // Linking expenses to the group

    isDeleted: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default model("Group", groupSchema);
