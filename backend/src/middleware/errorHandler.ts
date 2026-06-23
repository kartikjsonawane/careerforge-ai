import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`[${req.method}] ${req.path} — ${err.statusCode}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const errors = Object.values((err as any).errors).map((e: any) => e.message);
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }

  logger.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
};
