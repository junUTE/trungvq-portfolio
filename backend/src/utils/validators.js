import { hasLocalizedContent } from "./localization.js";

const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateProjectPayload(payload) {
  const errors = [];
  const githubLink = normalizeString(payload.githubLink);
  const demoLink = normalizeString(payload.demoLink);

  if (!hasLocalizedContent(payload.title)) {
    errors.push("Title is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.summary)) {
    errors.push("Summary is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.description)) {
    errors.push("Description is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.content)) {
    errors.push("Content is required in at least one language.");
  }

  if (payload.myRole && !hasLocalizedContent(payload.myRole)) {
    errors.push("My role must contain content when provided.");
  }

  if (!Array.isArray(payload.technologies)) {
    errors.push("Technologies must be an array.");
  }

  if (githubLink && !urlPattern.test(githubLink)) {
    errors.push("GitHub link must be a valid URL.");
  }

  if (demoLink && !urlPattern.test(demoLink)) {
    errors.push("Demo link must be a valid URL.");
  }

  return errors;
}

export function validateCodePayload(payload) {
  const errors = [];
  const owner = normalizeString(payload.owner);
  const name = normalizeString(payload.name);
  const repositoryUrl = normalizeString(payload.repositoryUrl);
  const tags = Array.isArray(payload.tags) ? payload.tags : null;

  if (owner.length < 2) {
    errors.push("Owner must be at least 2 characters.");
  }

  if (name.length < 2) {
    errors.push("Repository name must be at least 2 characters.");
  }

  if (!hasLocalizedContent(payload.summary)) {
    errors.push("Summary is required in at least one language.");
  }

  if (!repositoryUrl || !urlPattern.test(repositoryUrl)) {
    errors.push("Repository URL must be a valid URL.");
  }

  if (!tags) {
    errors.push("Tags must be an array.");
  } else if (
    tags.some(
      (tag) =>
        !tag ||
        !hasLocalizedContent(tag.label) ||
        (tag.color !== undefined && typeof tag.color !== "string")
    )
  ) {
    errors.push("Each tag must include a label and an optional color.");
  }

  return errors;
}

export function validateContactPayload(payload) {
  const errors = [];
  const name = normalizeString(payload.name);
  const email = normalizeString(payload.email).toLowerCase();
  const message = normalizeString(payload.message);

  if (!name) {
    errors.push("Name is required.");
  }

  if (!emailPattern.test(email)) {
    errors.push("Email is invalid.");
  }

  if (message.length < 10) {
    errors.push("Message must be at least 10 characters.");
  }

  return errors;
}

export function validateAuthPayload(payload) {
  const errors = [];
  const username = normalizeString(payload.username);
  const password = normalizeString(payload.password);

  if (!username) {
    errors.push("Username is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
}

export function validateContactStatusPayload(payload) {
  const errors = [];

  if (!["unread", "replied"].includes(payload.status)) {
    errors.push("Status must be unread or replied.");
  }

  return errors;
}

export function validateAssetPayload(payload) {
  const errors = [];
  const url = normalizeString(payload.url);
  const publicId = normalizeString(payload.publicId);
  const file = normalizeString(payload.file);

  if (!file && !url) {
    errors.push("Asset file or URL is required.");
  }

  if (url && !urlPattern.test(url)) {
    errors.push("Asset URL must be a valid URL.");
  }

  if (url && !publicId) {
    errors.push("Public ID is required when using an existing asset URL.");
  }

  return errors;
}

export function validateProfilePayload(payload) {
  const errors = [];
  const displayName = normalizeString(payload.displayName);
  const brandInitials = normalizeString(payload.brandInitials);
  const headerAvatarUrl = normalizeString(payload.headerAvatarUrl);
  const githubUrl = normalizeString(payload.githubUrl);
  const linkedinUrl = normalizeString(payload.linkedinUrl);
  const introSegments = Array.isArray(payload.introSegments) ? payload.introSegments : [];

  if (displayName.length < 2) {
    errors.push("Display name must be at least 2 characters.");
  }

  if (!brandInitials) {
    errors.push("Brand initials are required.");
  }

  if (!hasLocalizedContent(payload.heroTitle)) {
    errors.push("Hero title is required in at least one language.");
  }

  if (introSegments.length === 0) {
    errors.push("Intro segments are required.");
  }

  if (
    introSegments.some(
      (segment) =>
        !segment ||
        !hasLocalizedContent(segment.text) ||
        (segment.tone !== undefined && typeof segment.tone !== "string")
    )
  ) {
    errors.push("Each intro segment must include text and an optional tone.");
  }

  if (!hasLocalizedContent(payload.goalDescription)) {
    errors.push("Goal description is required in at least one language.");
  }

  if (headerAvatarUrl && !urlPattern.test(headerAvatarUrl)) {
    errors.push("Header avatar URL must be a valid URL.");
  }

  if (githubUrl && !urlPattern.test(githubUrl)) {
    errors.push("GitHub URL must be a valid URL.");
  }

  if (linkedinUrl && !urlPattern.test(linkedinUrl)) {
    errors.push("LinkedIn URL must be a valid URL.");
  }

  return errors;
}

export function validateArticlePayload(payload) {
  const errors = [];
  if (!hasLocalizedContent(payload.title)) {
    errors.push("Article title is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.category)) {
    errors.push("Category is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.readTime)) {
    errors.push("Read time is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.excerpt)) {
    errors.push("Excerpt is required in at least one language.");
  }

  return errors;
}

export function validateWorkPayload(payload) {
  const errors = [];
  if (!hasLocalizedContent(payload.title)) {
    errors.push("Work title is required in at least one language.");
  }

  if (!hasLocalizedContent(payload.summary)) {
    errors.push("Summary is required in at least one language.");
  }

  if (!Array.isArray(payload.highlights)) {
    errors.push("Highlights must be an array.");
  } else if (payload.highlights.some((item) => !hasLocalizedContent(item))) {
    errors.push("Each highlight must be filled in at least one language.");
  }

  return errors;
}
