import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import healthRouter from "./routes/health.routes.js";

dotenv.config();

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "Portfolio backend is ready for day 1.",
    docs: {
      health: "/api/health"
    }
  });
});

app.use("/api/health", healthRouter);

export default app;
