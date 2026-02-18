import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, 
});

export const Token = mongoose.model("Token", tokenSchema);
