import Article from "../models/article.model.js";
import Code from "../models/code.model.js";
import Contact from "../models/contact.model.js";
import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import Work from "../models/work.model.js";
import { deleteImageAsset, uploadImageAsset } from "../services/cloudinary.service.js";
import { getLocalizedText, toLocalizedValue } from "../utils/localization.js";
import { slugify } from "../utils/slugify.js";
import {
  validateAssetPayload,
  validateArticlePayload,
  validateCodePayload,
  validateContactStatusPayload,
  validateProfilePayload,
  validateProjectPayload
  ,
  validateWorkPayload
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
  const title = toLocalizedValue(body.title);
  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(getLocalizedText(title));
  const technologies = Array.isArray(body.technologies)
    ? body.technologies
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    : [];

  return {
    title,
    slug,
    summary: toLocalizedValue(body.summary),
    description: toLocalizedValue(body.description),
    content: toLocalizedValue(body.content),
    myRole: body.myRole ? toLocalizedValue(body.myRole) : "",
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

function normalizeProfilePayload(body, currentProfile = null) {
  const introSegments = Array.isArray(body.introSegments)
    ? body.introSegments
        .map((segment) => ({
          text: toLocalizedValue(segment?.text),
          tone: typeof segment?.tone === "string" ? segment.tone.trim() : ""
        }))
        .filter((segment) => getLocalizedText(segment.text))
    : currentProfile?.introSegments || [];

  return {
    key: "main",
    displayName: body.displayName.trim(),
    brandInitials: body.brandInitials.trim(),
    headerAvatarUrl:
      typeof body.headerAvatarUrl === "string" ? body.headerAvatarUrl.trim() : currentProfile?.headerAvatarUrl || "",
    heroTitle: toLocalizedValue(body.heroTitle),
    introSegments,
    goalDescription: toLocalizedValue(body.goalDescription),
    githubUrl: typeof body.githubUrl === "string" ? body.githubUrl.trim() : currentProfile?.githubUrl || "",
    linkedinUrl:
      typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim() : currentProfile?.linkedinUrl || ""
  };
}

function normalizeArticlePayload(body) {
  const title = toLocalizedValue(body.title);

  return {
    title,
    slug: body.slug?.trim() ? slugify(body.slug) : slugify(getLocalizedText(title)),
    category: toLocalizedValue(body.category),
    readTime: toLocalizedValue(body.readTime),
    excerpt: toLocalizedValue(body.excerpt),
    tone: typeof body.tone === "string" && body.tone.trim() ? body.tone.trim() : "from-slate-200 to-slate-100",
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    status: body.status === "published" ? "published" : "draft",
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0
  };
}

function normalizeWorkPayload(body) {
  const highlights = Array.isArray(body.highlights)
    ? body.highlights
        .map((item) => toLocalizedValue(item))
        .filter((item) => getLocalizedText(item))
    : [];

  return {
    title: toLocalizedValue(body.title),
    company: body.company ? toLocalizedValue(body.company) : "",
    period: body.period ? toLocalizedValue(body.period) : "",
    summary: toLocalizedValue(body.summary),
    highlights,
    status: body.status === "published" ? "published" : "draft",
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0
  };
}

function normalizeCodePayload(body) {
  const tags = Array.isArray(body.tags)
    ? body.tags
        .map((tag) => ({
          label: toLocalizedValue(tag?.label),
          color: typeof tag?.color === "string" && tag.color.trim() ? tag.color.trim() : "bg-slate-500"
        }))
        .filter((tag) => getLocalizedText(tag.label))
    : [];

  return {
    owner: body.owner.trim(),
    name: body.name.trim(),
    summary: toLocalizedValue(body.summary),
    repositoryUrl: body.repositoryUrl.trim(),
    tags,
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

export async function getAdminProfile(_request, response, next) {
  try {
    const profile = await Profile.findOne({ key: "main" }).lean();

    return response.status(200).json({
      data: profile
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminProfile(request, response, next) {
  try {
    const errors = validateProfilePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const existingProfile = await Profile.findOne({ key: "main" });
    const nextPayload = normalizeProfilePayload(request.body, existingProfile);
    const profile = existingProfile
      ? Object.assign(existingProfile, nextPayload)
      : new Profile(nextPayload);

    await profile.save();

    return response.status(200).json({
      message: "Profile updated successfully.",
      data: profile
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

export async function getAdminArticles(_request, response, next) {
  try {
    const articles = await Article.find().sort({ order: 1, publishedAt: -1, createdAt: -1 }).lean();

    return response.status(200).json({
      data: articles
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminArticle(request, response, next) {
  try {
    const errors = validateArticlePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const article = await Article.create(normalizeArticlePayload(request.body));

    return response.status(201).json({
      message: "Article created successfully.",
      data: article
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: "Article slug already exists."
      });
    }

    return next(error);
  }
}

export async function updateAdminArticle(request, response, next) {
  try {
    const article = await Article.findById(request.params.id);

    if (!article) {
      return response.status(404).json({
        message: "Article not found."
      });
    }

    const errors = validateArticlePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    Object.assign(article, normalizeArticlePayload(request.body));
    await article.save();

    return response.status(200).json({
      message: "Article updated successfully.",
      data: article
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: "Article slug already exists."
      });
    }

    return next(error);
  }
}

export async function deleteAdminArticle(request, response, next) {
  try {
    const article = await Article.findByIdAndDelete(request.params.id);

    if (!article) {
      return response.status(404).json({
        message: "Article not found."
      });
    }

    return response.status(200).json({
      message: "Article deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminWorkItems(_request, response, next) {
  try {
    const workItems = await Work.find().sort({ order: 1, createdAt: -1 }).lean();

    return response.status(200).json({
      data: workItems
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminCodeItems(_request, response, next) {
  try {
    const codeItems = await Code.find().sort({ order: 1, createdAt: -1 }).lean();

    return response.status(200).json({
      data: codeItems
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminCodeItem(request, response, next) {
  try {
    const errors = validateCodePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const codeItem = await Code.create(normalizeCodePayload(request.body));

    return response.status(201).json({
      message: "Code item created successfully.",
      data: codeItem
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminCodeItem(request, response, next) {
  try {
    const codeItem = await Code.findById(request.params.id);

    if (!codeItem) {
      return response.status(404).json({
        message: "Code item not found."
      });
    }

    const errors = validateCodePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    Object.assign(codeItem, normalizeCodePayload(request.body));
    await codeItem.save();

    return response.status(200).json({
      message: "Code item updated successfully.",
      data: codeItem
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminCodeItem(request, response, next) {
  try {
    const codeItem = await Code.findByIdAndDelete(request.params.id);

    if (!codeItem) {
      return response.status(404).json({
        message: "Code item not found."
      });
    }

    return response.status(200).json({
      message: "Code item deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminWorkItem(request, response, next) {
  try {
    const errors = validateWorkPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const workItem = await Work.create(normalizeWorkPayload(request.body));

    return response.status(201).json({
      message: "Work item created successfully.",
      data: workItem
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminWorkItem(request, response, next) {
  try {
    const workItem = await Work.findById(request.params.id);

    if (!workItem) {
      return response.status(404).json({
        message: "Work item not found."
      });
    }

    const errors = validateWorkPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    Object.assign(workItem, normalizeWorkPayload(request.body));
    await workItem.save();

    return response.status(200).json({
      message: "Work item updated successfully.",
      data: workItem
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminWorkItem(request, response, next) {
  try {
    const workItem = await Work.findByIdAndDelete(request.params.id);

    if (!workItem) {
      return response.status(404).json({
        message: "Work item not found."
      });
    }

    return response.status(200).json({
      message: "Work item deleted successfully."
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

    const profile = await Profile.findOne({ key: "main" });

    if (profile) {
      profile.headerAvatarUrl = asset.url;
      await profile.save();
    }

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
