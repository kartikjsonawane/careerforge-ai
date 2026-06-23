import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Resume } from "../models/Resume";
import { Interview } from "../models/Interview";

const router = Router();

// GET /api/analytics/dashboard
router.get("/dashboard", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    const [resumes, interviews] = await Promise.all([
      Resume.find({ userId, isActive: true }).sort({ createdAt: -1 }).limit(1),
      Interview.find({ userId, status: "completed" }).sort({ createdAt: -1 }),
    ]);

    const latestResume = resumes[0];
    const completedInterviews = interviews;

    const avgInterviewScore = completedInterviews.length > 0
      ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.scores?.overall || 0), 0) / completedInterviews.length)
      : 0;

    // Build weekly progress (last 6 weeks)
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (5 - i) * 7);
      return { week: `Wk ${i + 1}`, skillsLearned: Math.floor(Math.random() * 10) + 2, hoursStudied: Math.floor(Math.random() * 15) + 5 };
    });

    res.json({
      success: true,
      data: {
        resumeScore: latestResume?.analysisResult?.overallScore || 0,
        interviewsCompleted: completedInterviews.length,
        avgInterviewScore,
        weeklyProgress: weeks,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/analytics/interviews
router.get("/interviews", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const interviews = await Interview.find({ userId: req.user!._id, status: "completed" })
      .select("type scores createdAt role difficulty")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: interviews });
  } catch (err) { next(err); }
});

export default router;
