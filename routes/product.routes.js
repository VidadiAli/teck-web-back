import express from "express";
import { addProduct, getProducts, getProductByBarcod, getProductsBySeller, getProductsByCategory, getProductsById } from "../controllers/product.controller.js";
import { verifySellerToken, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/createProductByAdmin", verifyToken, addProduct);                       
router.get("/getProductsByAdmin", verifyToken, getProducts);        
router.post("/createProductBySeller", verifySellerToken, addProduct);                       
router.get("/getProductsBySeller/:sellerId", verifySellerToken, getProductsBySeller);                 
router.get("/getProductsByBarcod/:productByBarcod", verifySellerToken, getProductByBarcod);          
router.get("/getProductsByBarcodAsCustomer/:productByBarcod",  getProductByBarcod);                  
router.get("/getProducts", getProducts);                      
router.get("/getProductById/:productId", getProductsById);  
router.get("/getProductsByCategory/:category", getProductsByCategory);   

export default router;
