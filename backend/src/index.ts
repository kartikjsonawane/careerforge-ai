import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import { Server as SocketServer } from "socket.io";

import { connectDB } from "./config/database";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

// Routes
import authRoutes from "./routes/auth";
import resumeRoutes from "./routes/resumes";
import skillRoutes from "./routes/skills";
import conversationRoutes from "./routes/conversations";
import interviewRoutes from "./routes/interviews";
import projectRoutes from "./routes/projects";
import jobRoutes from "./routes/jobs";
import analyticsRoutes from "./routes/analytics";
import userRoutes from "./routes/users";
import { initSocketHandlers } from "./sockets";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ─── Socket.io ──────────────────────────────────────────────────────────────
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});
initSocketHandlers(io);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://careerforge.ai",
  ],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined", {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts." },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", service: "careerforge-api", version: "1.0.0" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Boot ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "5000", 10);

async function bootstrap() {
  await connectDB();
  server.listen(PORT, () => {
    logger.info(`🚀 CareerForge API running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

bootstrap().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});

export { io };
