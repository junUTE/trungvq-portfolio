import { Router } from "express";

import { getPublishedCodeItems } from "../controllers/code.controller.js";

const router = Router();

router.get("/", getPublishedCodeItems);

export default router;
