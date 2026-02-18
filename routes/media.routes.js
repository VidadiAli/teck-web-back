import express from "express";
import { addMedia, getMedia } from "../controllers/media.controller.js";

const router = express.Router();

router.post("/", addMedia);  // Yeni media əlavə etmək
router.get("/", getMedia);   // Bütün media-ları gətirmək

export default router;
