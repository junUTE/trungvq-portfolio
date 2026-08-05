import { Router } from "express";

import { getPublicProfile } from "../controllers/content.controller.js";

const router = Router();

router.get("/", getPublicProfile);

export default router;
