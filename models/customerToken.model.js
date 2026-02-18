import mongoose from "mongoose";

const customerTokenSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' }, // 7 gün sonra avtomatik silinir
});

export const CustomerToken = mongoose.model("CustomerToken", customerTokenSchema);
