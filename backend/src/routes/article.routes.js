import { Router } from "express";

import { getPublishedArticles } from "../controllers/content.controller.js";

const router = Router();

router.get("/", getPublishedArticles);

export default router;
