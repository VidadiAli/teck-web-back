import express from "express";
import { verifyCustomerToken } from "../controllers/customerToken.controller.js";
import { createProductOrder, getCustomerOrders, getOrdersAsSeller, updateOrderStatus } from "../controllers/productOrder.controller.js";
import { verifySellerToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/createOrder", verifyCustomerToken, createProductOrder);
router.get("/getOrdersAsCustomer", verifyCustomerToken, getCustomerOrders);
router.get("/getOrdersAsSeller", verifySellerToken, getOrdersAsSeller);
router.put("/updateStatus/:id", verifySellerToken, updateOrderStatus);


export default router;
