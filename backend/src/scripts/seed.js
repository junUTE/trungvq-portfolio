import dotenv from "dotenv";

import { connectToDatabase } from "../config/database.js";
import Project from "../models/project.model.js";
import seedProjects from "../data/seed-projects.js";
import { validateProjectPayload } from "../utils/validators.js";

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

  await Project.deleteMany({});
  await Project.insertMany(seedProjects);

  console.log(`Seeded ${seedProjects.length} projects.`);
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
