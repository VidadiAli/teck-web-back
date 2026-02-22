import express from "express";
import { createProductOrder, getCustomerOrders, getOrdersAsSeller, updateOrderStatus } from "../controllers/productOrder.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/createOrder",
    authenticate,
    authorize("customer"),
    createProductOrder);

router.get("/getOrdersAsCustomer",
    authenticate,
    authorize("customer"),
    getCustomerOrders);

router.get("/getOrdersAsSeller",
    authenticate,
    authorize("seller"), getOrdersAsSeller);

router.put("/updateStatus/:id",
    authenticate,
    authorize("seller"),
    updateOrderStatus);


export default router;
