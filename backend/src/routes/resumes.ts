import { Router, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Resume } from "../models/Resume";
import { AppError } from "../middleware/errorHandler";
import axios from "axios";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/resumes/",
  filename: (_, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new AppError("Only PDF and Word documents are allowed", 400) as unknown as null, false);
  },
});

// GET /api/resumes
router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resumes = await Resume.find({ userId: req.user!._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (err) { next(err); }
});

// GET /api/resumes/:id
router.get("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!resume) throw new AppError("Resume not found", 404);
    res.json({ success: true, data: resume });
  } catch (err) { next(err); }
});

// POST /api/resumes/upload
router.post("/upload", authenticate, upload.single("resume"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new AppError("No file uploaded", 400);

    const fileUrl = `${process.env.API_URL}/uploads/resumes/${req.file.filename}`;

    // Call AI service to parse resume
    let parsedData = {};
    try {
      const { data } = await axios.post(
        `${process.env.AI_SERVICE_URL}/resume/parse`,
        { file_path: req.file.path, file_name: req.file.originalname },
        { timeout: 30000 }
      );
      parsedData = data.parsed_data || {};
    } catch (aiErr) {
      // Continue without parsed data if AI service is down
    }

    const resume = await Resume.create({
      userId: req.user!._id,
      fileName: req.file.originalname,
      fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      parsedData,
    });

    // Update user's skills from parsed resume
    if ((parsedData as any).skills?.length) {
      await req.user!.updateOne({ $addToSet: { currentSkills: { $each: (parsedData as any).skills } } });
    }

    res.status(201).json({ success: true, data: resume });
  } catch (err) { next(err); }
});

// DELETE /api/resumes/:id
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { isActive: false }
    );
    if (!resume) throw new AppError("Resume not found", 404);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) { next(err); }
});

// PATCH /api/resumes/:id/analysis
router.patch("/:id/analysis", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { analysisResult: req.body.analysisResult },
      { new: true }
    );
    if (!resume) throw new AppError("Resume not found", 404);
    res.json({ success: true, data: resume });
  } catch (err) { next(err); }
});

export default router;
