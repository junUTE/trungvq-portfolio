import crypto from "crypto";

const CLOUDINARY_API_BASE = "https://api.cloudinary.com/v1_1";
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const defaultFolders = {
  project: "portfolio/projects",
  avatar: "portfolio/avatars"
};

function getCloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }

  return {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET
  };
}

export function isCloudinaryConfigured() {
  return Boolean(getCloudinaryConfig());
}

export async function uploadImageAsset({ file, fileName, folder, existingUrl, existingPublicId, assetType }) {
  if (existingUrl && existingPublicId && !file) {
    return {
      url: existingUrl.trim(),
      publicId: existingPublicId.trim()
    };
  }

  if (!file) {
    throw new Error("Image file is required.");
  }

  const config = getCloudinaryConfig();

  if (!config) {
    throw new Error("Cloudinary is not configured.");
  }

  validateDataUrl(file);

  const timestamp = Math.floor(Date.now() / 1000);
  const normalizedFolder = folder?.trim() || defaultFolders[assetType] || defaultFolders.project;
  const signature = signUploadParams(
    {
      folder: normalizedFolder,
      timestamp
    },
    config.apiSecret
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", normalizedFolder);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", config.apiKey);
  formData.append("signature", signature);

  if (fileName) {
    formData.append("public_id", sanitizePublicId(fileName));
  }

  const response = await fetch(`${CLOUDINARY_API_BASE}/${config.cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id
  };
}

export async function deleteImageAsset(publicId) {
  if (!publicId) {
    return false;
  }

  const config = getCloudinaryConfig();

  if (!config) {
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUploadParams({ public_id: publicId, timestamp }, config.apiSecret);
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", config.apiKey);
  formData.append("signature", signature);

  const response = await fetch(`${CLOUDINARY_API_BASE}/${config.cloudName}/image/destroy`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    return false;
  }

  return true;
}

function signUploadParams(params, apiSecret) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

function validateDataUrl(file) {
  const matches = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/.exec(file);

  if (!matches) {
    throw new Error("Only image data URLs are supported.");
  }

  const mimeType = matches[1].toLowerCase();

  if (!allowedMimeTypes.has(mimeType)) {
    throw new Error("Only jpg, jpeg, png, and webp images are supported.");
  }

  const base64 = file.slice(matches[0].length);
  const bytes = Buffer.byteLength(base64, "base64");
  const maxBytes = Number(process.env.MAX_UPLOAD_SIZE_BYTES || 5 * 1024 * 1024);

  if (bytes > maxBytes) {
    throw new Error(`Image must be smaller than ${Math.round(maxBytes / (1024 * 1024))}MB.`);
  }
}

function sanitizePublicId(fileName) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
