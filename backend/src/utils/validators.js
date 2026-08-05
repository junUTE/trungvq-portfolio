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
