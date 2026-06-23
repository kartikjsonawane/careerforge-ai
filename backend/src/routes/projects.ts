import { Router, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  difficulty: String,
  techStack: [String],
  status: { type: String, enum: ["idea", "planning", "in-progress", "completed"], default: "idea" },
  generatedData: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await Project.create({ userId: req.user!._id, ...req.body });
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

export default router;
