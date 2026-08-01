import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { generateAuthToken } from "../utils/auth.js";
import { validateAuthPayload } from "../utils/validators.js";

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

export async function loginAdmin(request, response, next) {
  try {
    const errors = validateAuthPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const username = request.body.username.trim();
    const password = request.body.password.trim();
    const user = await User.findOne({ username });

    if (!user) {
      return response.status(401).json({
        message: "Invalid username or password."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return response.status(401).json({
        message: "Invalid username or password."
      });
    }

    user.lastLogin = new Date();
    await user.save();

    return response.status(200).json({
      message: "Login successful.",
      data: {
        token: generateAuthToken(user),
        user: serializeUser(user)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentAdmin(request, response, next) {
  try {
    return response.status(200).json({
      data: {
        user: serializeUser(request.user)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export function logoutAdmin(_request, response) {
  return response.status(200).json({
    message: "Logout successful."
  });
}
