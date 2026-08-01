import jwt from "jsonwebtoken";

export function generateAuthToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username
    },
    secret,
    {
      expiresIn: "7d"
    }
  );
}

export function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.verify(token, secret);
}

export function extractBearerToken(headerValue = "") {
  const [scheme, token] = headerValue.split(" ");

  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token.trim();
}
