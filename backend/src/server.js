import dotenv from "dotenv";

import { connectToDatabase } from "./config/database.js";
import app from "./app.js";
import { ensureAdminAccount } from "./services/admin-bootstrap.service.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToDatabase();
  await ensureAdminAccount();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server.", error);
  process.exit(1);
});
