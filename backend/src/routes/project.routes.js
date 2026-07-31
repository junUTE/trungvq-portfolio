import { Router } from "express";

import {
  getProjectBySlug,
  getPublishedProjects
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getPublishedProjects);
router.get("/:slug", getProjectBySlug);

export default router;
