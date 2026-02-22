import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  addSeller,
  getMeAsSeller,
  getSellers,
  loginSeller,
  logoutSeller
} from "../controllers/seller.controller.js";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  authorize("admin"),
  addSeller
);

router.get(
  "/get",
  authenticate,
  authorize("admin"),
  getSellers
);

router.post("/login", loginSeller);

router.post(
  "/logout",
  authenticate,
  logoutSeller
);

router.get(
  "/getMeAsSeller",
  authenticate,
  authorize("seller"),
  getMeAsSeller
);

export default router;