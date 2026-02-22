import express from "express";
import { addProduct, getProducts, getProductByBarcod, getProductsBySeller, getProductsByCategory, getProductsById } from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/createProductByAdmin", 
  authenticate,
  authorize("admin"), 
  addProduct);     

router.get("/getProductsByAdmin", 
  authenticate,
  authorize("admin"), 
  getProducts);    

router.post("/createProductBySeller", 
  authenticate,
  authorize("seller"), 
  addProduct);      

router.get("/getProductsBySeller/:sellerId", 
  authenticate,
  authorize("seller"), 
  getProductsBySeller);

router.get("/getProductsByBarcod/:productByBarcod", 
  authenticate,
  authorize("seller"), 
  getProductByBarcod);   

router.get("/getProductsByBarcodAsCustomer/:productByBarcod",  getProductByBarcod);                  
router.get("/getProducts", getProducts);                      
router.get("/getProductById/:productId", getProductsById);  
router.get("/getProductsByCategory/:category", getProductsByCategory);   

export default router;
