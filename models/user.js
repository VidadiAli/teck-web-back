import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: String,
    itemName: String,
    price: String,
    serialNumber: String,
    hasDiscount: Boolean,
    discountPercent: Number,
    rating: Number,
    salesCount: Number,
    itemImage: String,
    salesCompany: String,
    productNumber: String,
    productStatus: Number,
    quantity: Number
}, { timestamps: true });

export default mongoose.model("ItemStatus", userSchema);
