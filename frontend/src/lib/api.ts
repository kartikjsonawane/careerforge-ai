import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const AI_URL = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";

function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 60000,
  });

  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cf_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cf_token");
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const api = createApiClient(API_URL);
export const aiApi = createApiClient(AI_URL);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  googleOAuth: (token: string) =>
    api.post("/auth/google", { token }),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// Resume
export const resumeApi = {
  upload: (formData: FormData) =>
    api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  analyze: (resumeId: string, jobDescription?: string) =>
    aiApi.post("/resume/analyze", { resume_id: resumeId, job_description: jobDescription }),
  getAll: () => api.get("/resumes"),
  getById: (id: string) => api.get(`/resumes/${id}`),
  delete: (id: string) => api.delete(`/resumes/${id}`),
  getScore: (resumeId: string) => aiApi.get(`/resume/score/${resumeId}`),
};

// Skill Gap
export const skillApi = {
  analyze: (data: { current_skills: string[]; target_role: string }) =>
    aiApi.post("/skills/analyze", data),
  getRoadmap: (data: { target_role: string; current_skills: string[]; timeframe: string }) =>
    aiApi.post("/roadmap/generate", data),
  updateProgress: (skillId: string, progress: number) =>
    api.patch(`/skills/${skillId}/progress`, { progress }),
  getUserSkills: () => api.get("/skills"),
};

// Mentor
export const mentorApi = {
  chat: (message: string, sessionId?: string) =>
    aiApi.post("/mentor/chat", { message, session_id: sessionId }),
  getHistory: (sessionId: string) =>
    api.get(`/conversations/${sessionId}`),
  getSessions: () => api.get("/conversations"),
  newSession: () => api.post("/conversations"),
};

// Interview
export const interviewApi = {
  start: (data: { type: string; role: string; difficulty: string }) =>
    aiApi.post("/interview/start", data),
  respond: (sessionId: string, answer: string) =>
    aiApi.post(`/interview/${sessionId}/respond`, { answer }),
  end: (sessionId: string) =>
    aiApi.post(`/interview/${sessionId}/end`),
  getReport: (sessionId: string) =>
    api.get(`/interviews/${sessionId}/report`),
  getHistory: () => api.get("/interviews"),
};

// Projects
export const projectApi = {
  generate: (data: { skills: string[]; interests: string[]; difficulty: string }) =>
    aiApi.post("/projects/generate", data),
  getAll: () => api.get("/projects"),
  save: (projectData: Record<string, unknown>) =>
    api.post("/projects", projectData),
  updateStatus: (id: string, status: string) =>
    api.patch(`/projects/${id}/status`, { status }),
};

// Jobs
export const jobApi = {
  match: (resumeId: string) =>
    aiApi.post("/jobs/match", { resume_id: resumeId }),
  getMatches: () => api.get("/jobs/matches"),
  saveApplication: (jobData: Record<string, unknown>) =>
    api.post("/jobs/applications", jobData),
  getApplications: () => api.get("/jobs/applications"),
  updateApplication: (id: string, status: string) =>
    api.patch(`/jobs/applications/${id}`, { status }),
};

// Analytics
export const analyticsApi = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getSkillProgress: () => api.get("/analytics/skills"),
  getInterviewStats: () => api.get("/analytics/interviews"),
  getApplicationFunnel: () => api.get("/analytics/applications"),
};
