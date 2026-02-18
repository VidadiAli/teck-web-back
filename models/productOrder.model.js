import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  orderStatus: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const ProductOrder = mongoose.model("ProductOrder", productOrderSchema);
