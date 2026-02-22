import express from "express";
import {
  getBasket,
  addToBasket,
  increaseQuantity,
  decreaseQuantity,
  getBasketCount,
  removeFromBasket
} from "../controllers/basket.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";


const router = express.Router();

router.get("/",
  authenticate,
  authorize("customer"),
  getBasket);

router.post("/addToBasket",
  authenticate,
  authorize("customer"),
  addToBasket);

router.post("/increase",
  authenticate,
  authorize("customer"),
  increaseQuantity);

router.post("/decrease",
  authenticate,
  authorize("customer"),
  decreaseQuantity);

router.get("/count",
  authenticate,
  authorize("customer"),
  getBasketCount);

router.post("/remove",
  authenticate,
  authorize("customer"),
  removeFromBasket);

export default router;
