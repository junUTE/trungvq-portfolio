const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateProjectPayload(payload) {
  const errors = [];
  const title = normalizeString(payload.title);
  const summary = normalizeString(payload.summary);
  const description = normalizeString(payload.description);
  const content = normalizeString(payload.content);
  const githubLink = normalizeString(payload.githubLink);
  const demoLink = normalizeString(payload.demoLink);

  if (title.length < 3) {
    errors.push("Title must be at least 3 characters.");
  }

  if (!summary) {
    errors.push("Summary is required.");
  }

  if (!description) {
    errors.push("Description is required.");
  }

  if (!content) {
    errors.push("Content is required.");
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
  const heroTitle = normalizeString(payload.heroTitle);
  const goalDescription = normalizeString(payload.goalDescription);
  const githubUrl = normalizeString(payload.githubUrl);
  const linkedinUrl = normalizeString(payload.linkedinUrl);
  const introSegments = Array.isArray(payload.introSegments) ? payload.introSegments : [];

  if (heroTitle.length < 3) {
    errors.push("Hero title must be at least 3 characters.");
  }

  if (introSegments.length === 0) {
    errors.push("Intro segments are required.");
  }

  if (
    introSegments.some(
      (segment) =>
        !segment ||
        typeof segment.text !== "string" ||
        !segment.text.trim() ||
        (segment.tone !== undefined && typeof segment.tone !== "string")
    )
  ) {
    errors.push("Each intro segment must include text and an optional tone.");
  }

  if (!goalDescription) {
    errors.push("Goal description is required.");
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
  const title = normalizeString(payload.title);
  const category = normalizeString(payload.category);
  const readTime = normalizeString(payload.readTime);
  const excerpt = normalizeString(payload.excerpt);

  if (title.length < 3) {
    errors.push("Article title must be at least 3 characters.");
  }

  if (!category) {
    errors.push("Category is required.");
  }

  if (!readTime) {
    errors.push("Read time is required.");
  }

  if (!excerpt) {
    errors.push("Excerpt is required.");
  }

  return errors;
}

export function validateWorkPayload(payload) {
  const errors = [];
  const title = normalizeString(payload.title);
  const summary = normalizeString(payload.summary);

  if (title.length < 3) {
    errors.push("Work title must be at least 3 characters.");
  }

  if (!summary) {
    errors.push("Summary is required.");
  }

  if (!Array.isArray(payload.highlights)) {
    errors.push("Highlights must be an array.");
  }

  return errors;
}
