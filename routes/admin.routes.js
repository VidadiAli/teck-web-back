import express from "express";
import { addAdmin, loginAdmin, getAdmins, deleteAdmin, getMyProfile, logoutAdmin } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", addAdmin);

router.post("/login", loginAdmin);

router.get("/",
    authenticate,
    authorize("admin"),
    getAdmins);

router.delete("/:id",
    authenticate,
    authorize("admin"),
    deleteAdmin);

router.get("/getMe",
    authenticate,
    authorize("admin"),
    getMyProfile);


router.post("/logout",
    authenticate,
    authorize("admin"),
    logoutAdmin);

export default router;


