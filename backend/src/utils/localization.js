function normalizeText(value, { preserveWhitespace = false } = {}) {
  if (typeof value !== "string") {
    return "";
  }

  return preserveWhitespace ? value.replace(/\r\n/g, "\n") : value.trim();
}

export function isLocalizedObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function toLocalizedValue(value, options = {}) {
  if (isLocalizedObject(value)) {
    return {
      vi: normalizeText(value.vi, options),
      en: normalizeText(value.en, options)
    };
  }

  const normalized = normalizeText(value, options);

  return {
    vi: normalized,
    en: normalized
  };
}

export function hasLocalizedContent(value) {
  if (typeof value === "string") {
    return normalizeText(value).length > 0;
  }

  if (isLocalizedObject(value)) {
    return normalizeText(value.vi).length > 0 || normalizeText(value.en).length > 0;
  }

  return false;
}

export function getLocalizedText(value, language = "vi") {
  if (typeof value === "string") {
    return normalizeText(value);
  }

  if (isLocalizedObject(value)) {
    return normalizeText(value[language]) || normalizeText(value.vi) || normalizeText(value.en);
  }

  return "";
}
