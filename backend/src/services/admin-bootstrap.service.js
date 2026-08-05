import bcrypt from "bcrypt";

import User from "../models/user.model.js";

export async function ensureAdminAccount() {
  const username = (process.env.ADMIN_USERNAME || "").trim();
  const password = (process.env.ADMIN_PASSWORD || "").trim();

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const existingAdmin = await User.findOne({ username });

  if (!existingAdmin) {
    await User.create({
      username,
      passwordHash,
      role: "admin"
    });

    return;
  }

  existingAdmin.passwordHash = passwordHash;
  existingAdmin.role = "admin";
  await existingAdmin.save();
}
