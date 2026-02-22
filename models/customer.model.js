import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
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

  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: "customer"
  }

}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
