import { Router } from "express";

import { createContact } from "../controllers/contact.controller.js";
import { contactRateLimiter } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router.post("/", contactRateLimiter, createContact);

export default router;
