import express from "express";
import { addAdmin, loginAdmin, getAdmins, deleteAdmin, getMyProfile, logoutAdmin, refreshAdminToken } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", addAdmin);

router.post("/login", loginAdmin);

router.get("/", getAdmins);

router.delete("/:id", deleteAdmin);

router.get("/getMe", verifyToken, getMyProfile);

router.post("/refreshToken", refreshAdminToken);

router.post("/logout", logoutAdmin);


export default router;
