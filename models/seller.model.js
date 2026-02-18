import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\+?[0-9]{10,15}$/
  },
  company: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);
