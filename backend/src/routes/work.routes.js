import { Router } from "express";

import { getPublishedWorkItems } from "../controllers/content.controller.js";

const router = Router();

router.get("/", getPublishedWorkItems);

export default router;
