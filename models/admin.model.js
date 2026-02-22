import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: "admin"
  },
  password: { type: String, required: true }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
