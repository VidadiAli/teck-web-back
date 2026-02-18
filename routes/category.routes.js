import express from "express";
import { addCategory, getCategories, getCategoryById } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/createCategory", addCategory);      // Yeni category əlavə etmək
router.get("/getCategories", getCategories);     // Bütün category-ləri gətirmək
router.get("/getCategories/:_id", getCategoryById); 

export default router;
