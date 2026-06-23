import { Router, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Interview } from "../models/Interview";
import { AppError } from "../middleware/errorHandler";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const interviews = await Interview.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: interviews });
  } catch (err) { next(err); }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, role, difficulty } = req.body;
    if (!type || !role || !difficulty) throw new AppError("type, role, difficulty required", 400);
    const interview = await Interview.create({ userId: req.user!._id, type, role, difficulty, sessionId: uuidv4() });
    res.status(201).json({ success: true, data: interview });
  } catch (err) { next(err); }
});

router.get("/:id/report", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!interview) throw new AppError("Interview not found", 404);
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

router.patch("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true }
    );
    if (!interview) throw new AppError("Interview not found", 404);
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

export default router;
