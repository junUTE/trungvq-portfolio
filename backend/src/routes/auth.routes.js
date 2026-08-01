import { Router } from "express";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin
} from "../controllers/auth.controller.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", requireAdminAuth, getCurrentAdmin);

export default router;
