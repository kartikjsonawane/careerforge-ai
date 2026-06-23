import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.patch("/profile", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ["name", "bio", "targetRole", "linkedinUrl", "githubUrl", "portfolioUrl", "currentSkills"];
    const updates: Record<string, unknown> = {};
    allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    await req.user!.updateOne(updates);
    const updated = await (req.user! as any).constructor.findById(req.user!._id);
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;
