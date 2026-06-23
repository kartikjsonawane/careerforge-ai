import { Router, Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new AppError("Name, email, and password required", 400);
    if (password.length < 8) throw new AppError("Password must be at least 8 characters", 400);

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new AppError("Email already registered", 409);

    const user = await User.create({ name, email, password });

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError("Email and password required", 400);

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.json({ success: true, token: accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/google
router.post("/google", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) throw new AppError("Google token required", 400);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new AppError("Invalid Google token", 400);

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture || user.avatar;
      await user.save({ validateBeforeSave: false });
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.json({ success: true, token: accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Refresh token required", 400);

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError("User not found", 401);

    const accessToken = signAccessToken(user._id.toString());
    res.json({ success: true, token: accessToken });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ success: true, ...req.user!.toJSON() });
});

// POST /api/auth/logout
router.post("/logout", authenticate, async (req: AuthRequest, res: Response) => {
  // In production, invalidate refresh token in Redis
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
