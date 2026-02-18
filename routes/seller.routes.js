import express from "express";
import { addSeller, getMeAsSeller, getSellers, loginSeller, logoutSeller, refreshSellerToken } from "../controllers/seller.controller.js";
import { verifySellerToken, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken,  addSeller);   
router.get("/get", verifyToken, getSellers);  
router.post("/login", loginSeller) 
router.post("/logout", logoutSeller)
router.post("/refreshToken", refreshSellerToken);
router.get("/getMeAsSeller", verifySellerToken,  getMeAsSeller);

export default router;
