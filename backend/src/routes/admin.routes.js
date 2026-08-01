import { Router } from "express";

import {
  createAdminProject,
  deleteAdminProject,
  getAdminContacts,
  getAdminProjects,
  updateAdminContact,
  updateAdminProject,
  uploadAdminAvatar,
  uploadProjectImage
} from "../controllers/admin.controller.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAdminAuth);

router.get("/projects", getAdminProjects);
router.post("/projects", createAdminProject);
router.put("/projects/:id", updateAdminProject);
router.delete("/projects/:id", deleteAdminProject);

router.get("/contacts", getAdminContacts);
router.patch("/contacts/:id", updateAdminContact);

router.post("/upload/project-image", uploadProjectImage);
router.post("/upload/avatar", uploadAdminAvatar);

export default router;
