import mongoose from "mongoose";

const basketSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      itemName: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      productBarcod: String
    }
  ]
}, { timestamps: true });

const Basket = mongoose.model("Basket", basketSchema);
export default Basket;
