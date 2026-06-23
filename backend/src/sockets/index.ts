import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export function initSocketHandlers(io: Server) {
  // Auth middleware for socket connections
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme") as { id: string };
      (socket as any).userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    logger.info(`Socket connected: ${socket.id} (user: ${userId})`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Interview real-time events
    socket.on("interview:start", (data) => {
      socket.join(`interview:${data.sessionId}`);
      socket.emit("interview:ready", { sessionId: data.sessionId });
    });

    socket.on("interview:answer", (data) => {
      // Forward to AI processing; emit feedback when ready
      socket.emit("interview:processing", { questionId: data.questionId });
    });

    // Mentor typing indicator
    socket.on("mentor:typing", (data) => {
      socket.emit("mentor:thinking", data);
    });

    // Resume analysis progress
    socket.on("resume:analyze", (data) => {
      const steps = ["Parsing document", "Extracting skills", "ATS scoring", "Gap analysis", "Generating recommendations"];
      let step = 0;
      const interval = setInterval(() => {
        if (step >= steps.length) {
          clearInterval(interval);
          socket.emit("resume:analysis_complete");
          return;
        }
        socket.emit("resume:progress", { step: steps[step], progress: Math.round((step / steps.length) * 100) });
        step++;
      }, 600);
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}
