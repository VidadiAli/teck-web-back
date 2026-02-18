import express from "express";
import { refreshCustomerToken } from "../controllers/customerToken.controller.js";

const router = express.Router();

router.post("/refresh", refreshCustomerToken);

export default router;
