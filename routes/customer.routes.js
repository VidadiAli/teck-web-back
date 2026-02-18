import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomers
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/getAllCustomers", getCustomers);

export default router;
