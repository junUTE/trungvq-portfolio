import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const max = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5);

export const contactRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many contact requests. Please try again later."
  }
});
