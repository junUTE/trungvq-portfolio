import Contact from "../models/contact.model.js";
import Project from "../models/project.model.js";
import { deleteImageAsset, uploadImageAsset } from "../services/cloudinary.service.js";
import { slugify } from "../utils/slugify.js";
import {
  validateAssetPayload,
  validateContactStatusPayload,
  validateProjectPayload
} from "../utils/validators.js";

function serializeUser(user) {
  return {
    id: user._id,
    username: user.username,
    role: user.role,
    avatar: user.avatar,
    avatarPublicId: user.avatarPublicId,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function normalizeProjectPayload(body, currentProject = null) {
  const title = body.title.trim();
  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  const technologies = Array.isArray(body.technologies)
    ? body.technologies
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    : [];

  return {
    title,
    slug,
    summary: body.summary.trim(),
    description: body.description.trim(),
    content: body.content.trim(),
    technologies,
    githubLink: typeof body.githubLink === "string" ? body.githubLink.trim() : "",
    demoLink: typeof body.demoLink === "string" ? body.demoLink.trim() : "",
    image: typeof body.image === "string" ? body.image.trim() : currentProject?.image || "",
    imagePublicId:
      typeof body.imagePublicId === "string"
        ? body.imagePublicId.trim()
        : currentProject?.imagePublicId || "",
    featured: Boolean(body.featured),
    status: body.status === "published" ? "published" : "draft",
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0
  };
}

export async function getAdminProjects(_request, response, next) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();

    return response.status(200).json({
      data: projects
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminProject(request, response, next) {
  try {
    const errors = validateProjectPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const project = await Project.create(normalizeProjectPayload(request.body));

    return response.status(201).json({
      message: "Project created successfully.",
      data: project
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: "Project slug already exists."
      });
    }

    return next(error);
  }
}

export async function updateAdminProject(request, response, next) {
  try {
    const existingProject = await Project.findById(request.params.id);

    if (!existingProject) {
      return response.status(404).json({
        message: "Project not found."
      });
    }

    const errors = validateProjectPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const nextPayload = normalizeProjectPayload(request.body, existingProject);
    const previousImagePublicId = existingProject.imagePublicId;
    Object.assign(existingProject, nextPayload);
    await existingProject.save();

    if (previousImagePublicId && previousImagePublicId !== nextPayload.imagePublicId) {
      await deleteImageAsset(previousImagePublicId);
    }

    return response.status(200).json({
      message: "Project updated successfully.",
      data: existingProject
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: "Project slug already exists."
      });
    }

    return next(error);
  }
}

export async function deleteAdminProject(request, response, next) {
  try {
    const project = await Project.findByIdAndDelete(request.params.id);

    if (!project) {
      return response.status(404).json({
        message: "Project not found."
      });
    }

    if (project.imagePublicId) {
      await deleteImageAsset(project.imagePublicId);
    }

    return response.status(200).json({
      message: "Project deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminContacts(_request, response, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    return response.status(200).json({
      data: contacts
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminContact(request, response, next) {
  try {
    const errors = validateContactStatusPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const contact = await Contact.findById(request.params.id);

    if (!contact) {
      return response.status(404).json({
        message: "Contact not found."
      });
    }

    const status = request.body.status === "replied" ? "replied" : "unread";

    contact.status = status;
    contact.isRead = status === "replied";
    contact.repliedAt = status === "replied" ? new Date() : null;
    await contact.save();

    return response.status(200).json({
      message: "Contact updated successfully.",
      data: contact
    });
  } catch (error) {
    return next(error);
  }
}

export async function uploadProjectImage(request, response, next) {
  try {
    const errors = validateAssetPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const asset = await uploadImageAsset({
      file: request.body.file,
      fileName: request.body.fileName,
      folder: request.body.folder,
      existingUrl: request.body.url,
      existingPublicId: request.body.publicId,
      assetType: "project"
    });

    return response.status(200).json({
      message: "Project image uploaded successfully.",
      data: asset
    });
  } catch (error) {
    return next(error);
  }
}

export async function uploadAdminAvatar(request, response, next) {
  try {
    const errors = validateAssetPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const previousAvatarPublicId = request.user.avatarPublicId;
    const asset = await uploadImageAsset({
      file: request.body.file,
      fileName: request.body.fileName,
      folder: request.body.folder,
      existingUrl: request.body.url,
      existingPublicId: request.body.publicId,
      assetType: "avatar"
    });

    request.user.avatar = asset.url;
    request.user.avatarPublicId = asset.publicId;
    await request.user.save();

    if (previousAvatarPublicId && previousAvatarPublicId !== asset.publicId) {
      await deleteImageAsset(previousAvatarPublicId);
    }

    return response.status(200).json({
      message: "Admin avatar updated successfully.",
      data: {
        user: serializeUser(request.user)
      }
    });
  } catch (error) {
    return next(error);
  }
}
