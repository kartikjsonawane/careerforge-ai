import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  parsedData: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    skills: string[];
    experience: Array<{
      company: string;
      role: string;
      startDate: string;
      endDate?: string;
      description: string[];
      technologies: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      gpa?: number;
    }>;
    certifications: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
  };
  analysisResult?: {
    overallScore: number;
    atsScore: number;
    keywordScore: number;
    readabilityScore: number;
    impactScore: number;
    missingKeywords: string[];
    improvements: Array<{
      section: string;
      issue: string;
      suggestion: string;
      priority: "high" | "medium" | "low";
    }>;
    strengths: string[];
    weaknesses: string[];
    jobMatchScore?: number;
    targetJobDescription?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: Number,
    mimeType: String,
    parsedData: {
      name: String,
      email: String,
      phone: String,
      location: String,
      summary: String,
      skills: [String],
      experience: [{
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: [String],
        technologies: [String],
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: Number,
      }],
      certifications: [String],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        url: String,
      }],
    },
    analysisResult: {
      overallScore: Number,
      atsScore: Number,
      keywordScore: Number,
      readabilityScore: Number,
      impactScore: Number,
      missingKeywords: [String],
      improvements: [{
        section: String,
        issue: String,
        suggestion: String,
        priority: { type: String, enum: ["high", "medium", "low"] },
      }],
      strengths: [String],
      weaknesses: [String],
      jobMatchScore: Number,
      targetJobDescription: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>("Resume", ResumeSchema);
