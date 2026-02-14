import express from "express";
import { createRequestForSalesCompany, getRequestResultFromSalesCompany } from "../controllers/userController.js";

const router = express.Router();

router.get("/getItemStatus", getRequestResultFromSalesCompany);

router.post("/createItemStatus", createRequestForSalesCompany);

export default router;
