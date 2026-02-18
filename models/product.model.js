import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  serialNumber: { type: String, required: true, unique: true },
  hasDiscount: { type: Boolean, default: false },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  salesCount: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  itemImage: { type: String },
  salesCompany: { type: String },
  productBarcod: { type: String, required: true, },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
