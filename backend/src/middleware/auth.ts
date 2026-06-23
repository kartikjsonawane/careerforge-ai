import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { AppError } from "./errorHandler";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return next(new AppError("Authentication required", 401));

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError("User not found", 401));

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }
    return next(new AppError("Invalid token", 401));
  }
};

export const requirePlan = (plans: ("free" | "pro" | "enterprise")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    if (!plans.includes(req.user.plan)) {
      return next(new AppError("Upgrade your plan to access this feature", 403));
    }
    next();
  };
};
