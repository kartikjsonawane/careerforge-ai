// ─── User & Auth ────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  targetRole?: string;
  currentSkills: string[];
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Resume ─────────────────────────────────────────────────────────────────
export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  parsedData: ParsedResume;
  atsScore: number;
  analysisResult?: ResumeAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  projects: ResumeProject[];
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  readabilityScore: number;
  impactScore: number;
  missingKeywords: string[];
  improvements: Improvement[];
  strengths: string[];
  weaknesses: string[];
  jobMatchScore?: number;
}

export interface Improvement {
  section: string;
  issue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

// ─── Skills ─────────────────────────────────────────────────────────────────
export interface SkillGapReport {
  targetRole: string;
  currentMatchScore: number;
  readinessScore: number;
  missingSkills: MissingSkill[];
  presentSkills: PresentSkill[];
  estimatedTimeToReady: string;
  priorityLearningPath: string[];
}

export interface MissingSkill {
  name: string;
  priority: "critical" | "high" | "medium" | "low";
  demandScore: number;
  estimatedLearningTime: string;
  resources: Resource[];
}

export interface PresentSkill {
  name: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  relevanceScore: number;
}

export interface Resource {
  title: string;
  url: string;
  type: "course" | "book" | "video" | "article" | "project";
  provider: string;
  duration?: string;
  isFree: boolean;
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────
export interface LearningRoadmap {
  _id: string;
  userId: string;
  targetRole: string;
  totalWeeks: number;
  completionPercentage: number;
  weeks: RoadmapWeek[];
  milestones: Milestone[];
  createdAt: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  goals: string[];
  resources: Resource[];
  projects: string[];
  estimatedHours: number;
  isCompleted: boolean;
}

export interface Milestone {
  title: string;
  description: string;
  weekNumber: number;
  isAchieved: boolean;
  reward?: string;
}

// ─── Interview ───────────────────────────────────────────────────────────────
export interface InterviewSession {
  _id: string;
  userId: string;
  type: "technical" | "behavioral" | "system-design";
  role: string;
  difficulty: "junior" | "mid" | "senior";
  status: "active" | "completed";
  questions: InterviewQuestion[];
  scores?: InterviewScores;
  feedback?: string;
  duration: number;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "coding" | "conceptual" | "behavioral" | "system-design";
  difficulty: "easy" | "medium" | "hard";
  userAnswer?: string;
  feedback?: string;
  score?: number;
  hints?: string[];
}

export interface InterviewScores {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  systemDesign?: number;
  behavioralFit?: number;
}

// ─── Projects ────────────────────────────────────────────────────────────────
export interface ProjectIdea {
  _id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  techStack: string[];
  architecture: ProjectArchitecture;
  apiDesign: ApiEndpoint[];
  databaseSchema: DatabaseSchema;
  features: string[];
  resumeBulletPoints: string[];
  learningOutcomes: string[];
  status: "idea" | "planning" | "in-progress" | "completed";
}

export interface ProjectArchitecture {
  overview: string;
  components: ArchitectureComponent[];
  diagram?: string;
}

export interface ArchitectureComponent {
  name: string;
  description: string;
  technology: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: object;
  response?: object;
}

export interface DatabaseSchema {
  collections: Collection[];
}

export interface Collection {
  name: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

// ─── Job Applications ─────────────────────────────────────────────────────────
export interface JobMatch {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  matchScore: number;
  missingSkills: string[];
  matchedSkills: string[];
  salaryRange?: { min: number; max: number; currency: string };
  url: string;
  description: string;
  postedAt: string;
}

export interface JobApplication {
  _id: string;
  userId: string;
  job: Partial<JobMatch>;
  status: "bookmarked" | "applied" | "screening" | "interview" | "offer" | "rejected";
  appliedAt?: string;
  notes?: string;
  nextStep?: string;
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsDashboard {
  skillsLearned: number;
  interviewsCompleted: number;
  resumeScore: number;
  applicationSuccessRate: number;
  projectsCompleted: number;
  weeklyProgress: WeeklyProgress[];
  skillRadar: SkillRadarData[];
  applicationFunnel: ApplicationFunnelData[];
  interviewHistory: InterviewHistoryStat[];
}

export interface WeeklyProgress {
  week: string;
  skillsLearned: number;
  hoursStudied: number;
  interviewsPracticed: number;
}

export interface SkillRadarData {
  skill: string;
  current: number;
  target: number;
}

export interface ApplicationFunnelData {
  stage: string;
  count: number;
}

export interface InterviewHistoryStat {
  date: string;
  type: string;
  score: number;
}

// ─── Conversation ─────────────────────────────────────────────────────────────
export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface Citation {
  title: string;
  source: string;
  relevance: number;
}
