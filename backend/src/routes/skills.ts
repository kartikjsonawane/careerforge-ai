import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: { skills: req.user!.currentSkills, targetRole: req.user!.targetRole } });
  } catch (err) { next(err); }
});

router.patch("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { skills } = req.body;
    await req.user!.updateOne({ currentSkills: skills });
    res.json({ success: true, message: "Skills updated" });
  } catch (err) { next(err); }
});

export default router;
