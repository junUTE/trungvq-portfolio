import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { connectToDatabase } from "../config/database.js";
import Article from "../models/article.model.js";
import Code from "../models/code.model.js";
import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Work from "../models/work.model.js";
import seedArticles from "../data/seed-articles.js";
import seedCode from "../data/seed-code.js";
import seedProfile from "../data/seed-profile.js";
import seedProjects from "../data/seed-projects.js";
import seedWork from "../data/seed-work.js";
import {
  validateArticlePayload,
  validateCodePayload,
  validateProfilePayload,
  validateProjectPayload,
  validateWorkPayload
} from "../utils/validators.js";

dotenv.config();

async function seed() {
  await connectToDatabase();

  for (const project of seedProjects) {
    const errors = validateProjectPayload(project);

    if (errors.length > 0) {
      throw new Error(
        `Seed project "${project.title}" is invalid: ${errors.join(", ")}`
      );
    }
  }

  const profileErrors = validateProfilePayload(seedProfile);

  if (profileErrors.length > 0) {
    throw new Error(`Seed profile is invalid: ${profileErrors.join(", ")}`);
  }

  for (const article of seedArticles) {
    const errors = validateArticlePayload(article);

    if (errors.length > 0) {
      throw new Error(`Seed article "${article.title}" is invalid: ${errors.join(", ")}`);
    }
  }

  for (const codeItem of seedCode) {
    const errors = validateCodePayload(codeItem);

    if (errors.length > 0) {
      throw new Error(`Seed code "${codeItem.name}" is invalid: ${errors.join(", ")}`);
    }
  }

  for (const workItem of seedWork) {
    const errors = validateWorkPayload(workItem);

    if (errors.length > 0) {
      throw new Error(`Seed work item "${workItem.title}" is invalid: ${errors.join(", ")}`);
    }
  }

  await Project.deleteMany({});
  await Article.deleteMany({});
  await Code.deleteMany({});
  await Work.deleteMany({});
  await Profile.deleteMany({});
  await Project.insertMany(seedProjects);
  await Article.insertMany(seedArticles);
  await Code.insertMany(seedCode);
  await Work.insertMany(seedWork);
  await Profile.create(seedProfile);

  const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const adminPassword = (process.env.ADMIN_PASSWORD || "admin123456").trim();
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.deleteMany({ role: "admin" });
  await User.create({
    username: adminUsername,
    passwordHash,
    role: "admin"
  });

  console.log(
    `Seeded profile, ${seedProjects.length} projects, ${seedCode.length} code items, ${seedArticles.length} articles, ${seedWork.length} work items and admin "${adminUsername}".`
  );
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
