import mongoose from "mongoose";

const basketSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true // hər customer üçün 1 basket
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1
        }
      }
    ]
  },
  { timestamps: true }
);

const Basket = mongoose.model("Basket", basketSchema);
export default Basket;