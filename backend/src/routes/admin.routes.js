import { Router } from "express";

import {
  createAdminArticle,
  createAdminCodeItem,
  createAdminProject,
  createAdminWorkItem,
  deleteAdminCodeItem,
  deleteAdminProject,
  deleteAdminArticle,
  deleteAdminWorkItem,
  getAdminArticles,
  getAdminCodeItems,
  getAdminContacts,
  getAdminProfile,
  getAdminProjects,
  getAdminWorkItems,
  updateAdminArticle,
  updateAdminCodeItem,
  updateAdminContact,
  updateAdminProfile,
  updateAdminProject,
  updateAdminWorkItem,
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

router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

router.get("/articles", getAdminArticles);
router.post("/articles", createAdminArticle);
router.put("/articles/:id", updateAdminArticle);
router.delete("/articles/:id", deleteAdminArticle);

router.get("/code", getAdminCodeItems);
router.post("/code", createAdminCodeItem);
router.put("/code/:id", updateAdminCodeItem);
router.delete("/code/:id", deleteAdminCodeItem);

router.get("/work", getAdminWorkItems);
router.post("/work", createAdminWorkItem);
router.put("/work/:id", updateAdminWorkItem);
router.delete("/work/:id", deleteAdminWorkItem);

router.get("/contacts", getAdminContacts);
router.patch("/contacts/:id", updateAdminContact);

router.post("/upload/project-image", uploadProjectImage);
router.post("/upload/avatar", uploadAdminAvatar);

export default router;
