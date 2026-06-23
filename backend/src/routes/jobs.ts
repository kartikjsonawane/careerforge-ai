import { Router, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobData: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ["bookmarked", "applied", "screening", "interview", "offer", "rejected"], default: "bookmarked" },
  notes: String,
  nextStep: String,
  appliedAt: Date,
}, { timestamps: true });

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

router.get("/applications", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apps = await JobApplication.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: apps });
  } catch (err) { next(err); }
});

router.post("/applications", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await JobApplication.create({ userId: req.user!._id, ...req.body });
    res.status(201).json({ success: true, data: app });
  } catch (err) { next(err); }
});

router.patch("/applications/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: app });
  } catch (err) { next(err); }
});

export default router;
