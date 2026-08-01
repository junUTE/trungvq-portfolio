import User from "../models/user.model.js";
import { extractBearerToken, verifyAuthToken } from "../utils/auth.js";

export async function requireAdminAuth(request, response, next) {
  try {
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      return response.status(401).json({
        message: "Authentication required."
      });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user || user.role !== "admin") {
      return response.status(401).json({
        message: "Authentication required."
      });
    }

    request.user = user;
    return next();
  } catch (_error) {
    return response.status(401).json({
      message: "Authentication required."
    });
  }
}
