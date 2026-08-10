import { Router } from "express";

import { createContact, getContactStats } from "../controllers/contact.controller.js";
import { contactRateLimiter } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router.get("/stats", getContactStats);
router.post("/", contactRateLimiter, createContact);

export default router;
