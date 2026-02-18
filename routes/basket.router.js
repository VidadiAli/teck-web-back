import express from "express";
import {
  getBasket,
  addToBasket,
  increaseQuantity,
  decreaseQuantity,
  getBasketCount,
  removeFromBasket
} from "../controllers/basket.controller.js";
import { verifyCustomerToken } from "../controllers/customerToken.controller.js";


const router = express.Router();

router.get("/", verifyCustomerToken, getBasket);
router.post("/addToBasket", verifyCustomerToken, addToBasket);
router.post("/increase", verifyCustomerToken, increaseQuantity);
router.post("/decrease", verifyCustomerToken, decreaseQuantity);
router.get("/count", verifyCustomerToken, getBasketCount);
router.post("/remove", verifyCustomerToken, removeFromBasket);

export default router;
