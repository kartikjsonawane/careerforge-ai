import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
  targetRole?: string;
  currentSkills: string[];
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  plan: "free" | "pro" | "enterprise";
  isEmailVerified: boolean;
  lastActive: Date;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: 8 },
    avatar: String,
    googleId: { type: String, sparse: true, unique: true },
    targetRole: String,
    currentSkills: { type: [String], default: [] },
    bio: { type: String, maxlength: 500 },
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    isEmailVerified: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Indexes are already declared inline via unique:true — no duplicates needed

export const User = mongoose.model<IUser>("User", UserSchema);
