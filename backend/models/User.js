import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    income: { type: String, default: 0 },
    paymentMethod: { type: String, default: "" },
  },
  { timestamp: true }
);

// !  Integrate `bcrypt` for password hashing.

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update && this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  inputPassword,
  sotredPassword
) {
  return await bcrypt.compare(inputPassword, sotredPassword);
};

// ! remove password from response

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

export default model("User", userSchema);
