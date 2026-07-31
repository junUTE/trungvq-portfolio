import dotenv from "dotenv";

import { connectToDatabase } from "./config/database.js";
import app from "./app.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server.", error);
  process.exit(1);
});
