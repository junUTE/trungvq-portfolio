import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { getAllowedOrigins } from "./utils/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import contactRouter from "./routes/contact.routes.js";
import healthRouter from "./routes/health.routes.js";
import projectRouter from "./routes/project.routes.js";

dotenv.config();

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin is not allowed."));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "Portfolio backend public API is ready.",
    docs: {
      health: "/api/health",
      projects: "/api/projects",
      contacts: "/api/contacts",
      auth: "/api/auth",
      admin: "/api/admin"
    }
  });
});

app.use("/api/health", healthRouter);
app.use("/api/projects", projectRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
