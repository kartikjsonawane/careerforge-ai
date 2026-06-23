import mongoose, { Document, Schema } from "mongoose";

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  type: "technical" | "behavioral" | "system-design";
  role: string;
  difficulty: "junior" | "mid" | "senior";
  status: "active" | "completed" | "abandoned";
  questions: Array<{
    id: string;
    question: string;
    type: string;
    difficulty: string;
    userAnswer?: string;
    feedback?: string;
    score?: number;
    timeSpent?: number;
  }>;
  scores?: {
    overall: number;
    technical: number;
    communication: number;
    problemSolving: number;
    systemDesign?: number;
    behavioralFit?: number;
  };
  feedback?: string;
  duration: number;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["technical", "behavioral", "system-design"], required: true },
    role: { type: String, required: true },
    difficulty: { type: String, enum: ["junior", "mid", "senior"], required: true },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
    questions: [{
      id: String,
      question: String,
      type: String,
      difficulty: String,
      userAnswer: String,
      feedback: String,
      score: Number,
      timeSpent: Number,
    }],
    scores: {
      overall: Number,
      technical: Number,
      communication: Number,
      problemSolving: Number,
      systemDesign: Number,
      behavioralFit: Number,
    },
    feedback: String,
    duration: { type: Number, default: 0 },
    sessionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

InterviewSchema.index({ userId: 1, createdAt: -1 });

export const Interview = mongoose.model<IInterview>("Interview", InterviewSchema);
