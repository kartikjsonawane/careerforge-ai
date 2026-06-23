import { Router, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { authenticate, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New Conversation" },
  messages: [{
    role: { type: String, enum: ["user", "assistant"] },
    content: String,
    citations: [{ title: String, source: String }],
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);

router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const convos = await Conversation.find({ userId: req.user!._id }).sort({ updatedAt: -1 }).limit(20);
    res.json({ success: true, data: convos });
  } catch (err) { next(err); }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const convo = await Conversation.create({ userId: req.user!._id });
    res.status(201).json({ success: true, data: convo });
  } catch (err) { next(err); }
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const convo = await Conversation.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!convo) throw new AppError("Conversation not found", 404);
    res.json({ success: true, data: convo });
  } catch (err) { next(err); }
});

router.patch("/:id/messages", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const convo = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { $push: { messages: req.body.message }, $set: { title: req.body.title || undefined } },
      { new: true }
    );
    if (!convo) throw new AppError("Conversation not found", 404);
    res.json({ success: true, data: convo });
  } catch (err) { next(err); }
});

export default router;
