# CareerForge AI — Career Operating System

> An AI-powered platform for students and engineers to analyze resumes, close skill gaps, practice interviews, and accelerate career growth — powered by Groq AI, RAG, and a multi-agent architecture.

**Built by [Kartik Sonawane](https://github.com/kartiksonawane)**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.112-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000?logo=pinecone)](https://pinecone.io)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036)](https://groq.com)

---

## Architecture

```
                          ┌─────────────────────────────────┐
                          │        Next.js Frontend          │
                          │  TypeScript · Tailwind · Framer  │
                          └──────────────┬──────────────────┘
                                         │ REST + WebSocket
                          ┌──────────────▼──────────────────┐
                          │      Node.js API Gateway         │
                          │   Express · JWT · Socket.io      │
                          │   Rate Limiting · Auth · CORS    │
                          └──────────────┬──────────────────┘
                                         │ HTTP (internal)
                          ┌──────────────▼──────────────────┐
                          │      FastAPI AI Services         │
                          │  Multi-Agent Orchestrator        │
                          │  Gemini 1.5 Pro · RAG Pipeline   │
                          └────────┬──────────────┬─────────┘
                                   │              │
                     ┌─────────────▼──┐    ┌──────▼──────────┐
                     │  MongoDB Atlas  │    │    Pinecone      │
                     │  (Operational)  │    │  (Vector Store)  │
                     └─────────────────┘    └─────────────────┘
```

### Multi-Agent System

```
                       ┌─────────────────────┐
                       │  Agent Orchestrator  │
                       │  (Routes · Memory)   │
                       └──────────┬──────────┘
           ┌───────────┬──────────┼──────────┬───────────┐
    ┌──────▼───┐ ┌─────▼────┐ ┌──▼──────┐ ┌─▼────────┐ ┌▼──────────┐
    │  Resume  │ │  Skill   │ │ Mentor  │ │Interview │ │ Project  │
    │  Agent   │ │  Agent   │ │  Agent  │ │  Agent   │ │  Agent   │
    │(ATS/Gap) │ │(Market)  │ │ (RAG)   │ │(Coach)   │ │(Architect│
    └──────────┘ └──────────┘ └─────────┘ └──────────┘ └──────────┘
```

### RAG Pipeline

```
User Query ──► Embedding ──► Pinecone Search ──► Top-K Docs ──► Gemini + Context ──► Response
                                                      │
                            Resume · Notes · Interviews · Certifications · Projects
```

---

## Features

### AI Resume Studio
- PDF/DOCX parsing with pdfplumber
- ATS scoring across 5 dimensions (overall, ATS, keywords, readability, impact)
- Missing keyword detection against job descriptions
- Prioritized improvement roadmap (high/medium/low)
- Job description match scoring

### Skill Gap Analyzer
- Industry benchmark comparison for 10+ target roles
- Priority-ranked missing skills with learning time estimates
- Readiness score (0–100)
- Per-skill resource recommendations

### AI Learning Roadmap Generator
- Week-by-week personalized plan (adjustable timeframe)
- Auto-adapts based on progress and completed skills
- Course/book/article/project resource curation
- Milestone tracking with gamified streaks

### AI Career Mentor (RAG)
- Retrieval-Augmented Generation over user's full profile
- Context: resume, skills, learning history, interview results, notes
- Citation-based responses linked to source documents
- Persistent short-term and long-term memory

### Mock Interview Arena
- Technical (DSA/algorithms), Behavioral (STAR), System Design modes
- Per-question scoring rubric and detailed feedback
- Voice mode support via Web Speech API
- Historical score tracking and improvement trends

### AI Project Lab
- Project blueprints from skill input
- Full architecture diagrams, API design, database schema
- Ready-to-use resume bullet points
- Development roadmap per project

### Job Match Engine
- AI resume → job matching with match score
- Per-job skill gap breakdown
- Direct apply links and application tracking
- Application funnel visualization

### Analytics Dashboard
- Recharts-powered visual dashboards
- Skill progress radar, interview score trends, application funnel
- Weekly activity tracking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion |
| State | Zustand + React Query |
| API Gateway | Node.js, Express, Socket.io, JWT, Google OAuth |
| AI Services | Python, FastAPI, Uvicorn |
| LLM | Groq — LLaMA 3.3 70B / LLaMA 3.1 8B Instant |
| Vector DB | Pinecone (cosine similarity, serverless) |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Database | MongoDB Atlas (Mongoose) |
| File Storage | Local (dev) / AWS S3 (production) |
| Real-time | Socket.io |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (frontend), Render (backend + AI) |

---

## Project Structure

```
careerforge/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/    # Protected dashboard routes
│   │   │   │   ├── dashboard/  # Main dashboard
│   │   │   │   ├── resume/     # AI Resume Studio
│   │   │   │   ├── mentor/     # AI Career Mentor (chat)
│   │   │   │   ├── interview/  # Mock Interview Arena
│   │   │   │   ├── projects/   # AI Project Lab
│   │   │   │   ├── learning/   # Learning Hub & Roadmap
│   │   │   │   ├── jobs/       # Job Match Engine
│   │   │   │   └── analytics/  # Analytics Dashboard
│   │   │   ├── auth/           # Login / Register
│   │   │   └── page.tsx        # Landing page
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Topbar
│   │   │   └── shared/         # Reusable components
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios API clients
│   │   │   └── utils.ts        # Utility functions
│   │   ├── store/              # Zustand state stores
│   │   └── types/              # TypeScript interfaces
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── Dockerfile
│
├── backend/                     # Node.js API Gateway
│   ├── src/
│   │   ├── index.ts            # Express + Socket.io bootstrap
│   │   ├── config/
│   │   │   └── database.ts     # MongoDB Atlas connection
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Resume.ts
│   │   │   └── Interview.ts
│   │   ├── routes/             # Express route handlers
│   │   │   ├── auth.ts         # JWT + Google OAuth
│   │   │   ├── resumes.ts      # Resume CRUD + upload
│   │   │   ├── interviews.ts
│   │   │   ├── projects.ts
│   │   │   ├── jobs.ts
│   │   │   ├── skills.ts
│   │   │   ├── conversations.ts
│   │   │   ├── analytics.ts
│   │   │   └── users.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication middleware
│   │   │   └── errorHandler.ts
│   │   ├── sockets/
│   │   │   └── index.ts        # Socket.io event handlers
│   │   └── utils/
│   │       ├── jwt.ts
│   │       └── logger.ts
│   └── Dockerfile
│
├── ai-services/                 # FastAPI AI microservice
│   ├── main.py                 # FastAPI app bootstrap
│   ├── routers/
│   │   ├── resume.py           # Resume parse + analyze
│   │   ├── skills.py           # Skill gap analysis
│   │   ├── roadmap.py          # Roadmap generation
│   │   ├── mentor.py           # RAG mentor chat
│   │   ├── interview.py        # Interview Q&A + scoring
│   │   ├── projects.py         # Project blueprint generation
│   │   └── jobs.py             # Job matching
│   ├── agents/
│   │   └── orchestrator.py     # Multi-agent system
│   ├── utils/
│   │   ├── config.py           # Settings with pydantic
│   │   ├── gemini.py           # Gemini client + prompts
│   │   └── pinecone_client.py  # Vector DB operations
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Database Schema

### MongoDB Collections

**users**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed, bcrypt)",
  "googleId": "string (optional)",
  "avatar": "string (URL)",
  "targetRole": "string",
  "currentSkills": ["string"],
  "bio": "string",
  "linkedinUrl": "string",
  "githubUrl": "string",
  "plan": "free | pro | enterprise",
  "onboardingCompleted": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**resumes**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "fileName": "string",
  "fileUrl": "string",
  "parsedData": {
    "name": "string",
    "email": "string",
    "skills": ["string"],
    "experience": [{ "company": "...", "role": "...", "description": ["..."] }],
    "education": [{ "institution": "...", "degree": "..." }],
    "projects": [{ "name": "...", "technologies": ["..."] }]
  },
  "analysisResult": {
    "overallScore": "number",
    "atsScore": "number",
    "missingKeywords": ["string"],
    "improvements": [{ "section": "...", "issue": "...", "priority": "high|medium|low" }]
  },
  "createdAt": "Date"
}
```

**interviews**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "technical | behavioral | system-design",
  "role": "string",
  "difficulty": "junior | mid | senior",
  "questions": [{ "question": "...", "userAnswer": "...", "score": "number" }],
  "scores": { "overall": "number", "technical": "number", "communication": "number" },
  "sessionId": "string (uuid)",
  "status": "active | completed | abandoned"
}
```

**conversations** (AI Mentor sessions)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "messages": [{ "role": "user|assistant", "content": "...", "citations": [] }]
}
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload resume file |
| GET | `/api/resumes` | Get all user resumes |
| DELETE | `/api/resumes/:id` | Delete resume |

### AI Services (FastAPI)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/parse` | Parse resume file |
| POST | `/resume/analyze` | ATS score + improvements |
| POST | `/skills/analyze` | Skill gap report |
| POST | `/roadmap/generate` | Generate learning roadmap |
| POST | `/mentor/chat` | RAG mentor chat |
| POST | `/interview/start` | Start mock interview |
| POST | `/interview/{id}/respond` | Submit answer + get feedback |
| POST | `/projects/generate` | Generate project blueprint |
| POST | `/jobs/match` | Match jobs to resume |

---

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.12+
- MongoDB Atlas account (free tier)
- Pinecone account (free tier)
- Groq API key (free tier at console.groq.com)
- Google Cloud project (OAuth credentials, optional)

### 1. Clone and install

```bash
git clone https://github.com/kartiksonawane/careerforge-ai.git
cd careerforge-ai
```

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# AI Services
cd ../ai-services && pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, AI_SERVICE_URL

# AI Services
cp ai-services/.env.example ai-services/.env
# Fill in: GEMINI_API_KEY, PINECONE_API_KEY, MONGODB_URI

# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_AI_URL
```

### 3. Run development servers

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev        # http://localhost:3000

# Terminal 2 — API Gateway
cd backend && npm run dev         # http://localhost:5000

# Terminal 3 — AI Services
cd ai-services && uvicorn main:app --reload --port 8000
```

### 4. Run with Docker

```bash
docker-compose up --build
```

---

## Deployment

### Frontend — Vercel

```bash
cd frontend
vercel deploy --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` → your Render backend URL
- `NEXT_PUBLIC_AI_URL` → your Render AI services URL
- `NEXT_PUBLIC_SOCKET_URL` → your Render backend URL

### Backend + AI Services — Render

1. Create two **Web Services** on Render:
   - **careerforge-api** → `./backend` → build: `npm install && npm run build` → start: `npm start`
   - **careerforge-ai** → `./ai-services` → build: `pip install -r requirements.txt` → start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. Add all environment variables in Render dashboard

3. Enable **Auto-Deploy** from your main branch

### MongoDB Atlas
1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render dynamic IPs
3. Copy connection string to `MONGODB_URI`

### Pinecone
1. Create free account at [pinecone.io](https://pinecone.io)
2. Create index: name=`careerforge`, dimension=`768`, metric=`cosine`
3. Copy API key to `PINECONE_API_KEY`

### Groq API
1. Get free API key from [console.groq.com](https://console.groq.com)
2. Copy to `GROQ_API_KEY`

---

## Environment Variables Reference

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
GOOGLE_CLIENT_ID=<from GCP console>
GOOGLE_CLIENT_SECRET=<from GCP console>
FRONTEND_URL=https://careerforge.vercel.app
AI_SERVICE_URL=https://careerforge-ai.onrender.com
```

### AI Services (`ai-services/.env`)
```env
GROQ_API_KEY=<from console.groq.com>
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_FAST_MODEL=llama-3.1-8b-instant
PINECONE_API_KEY=<from Pinecone console>
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=careerforge
MONGODB_URI=mongodb+srv://...
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://careerforge-api.onrender.com/api
NEXT_PUBLIC_AI_URL=https://careerforge-ai.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://careerforge-api.onrender.com
NEXT_PUBLIC_APP_URL=https://careerforge.vercel.app
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and ensure all TypeScript types are properly defined.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Author

**Kartik Sonawane**
- GitHub: [@kartikjsonawane](https://github.com/kartikjsonawane)
- Email: kartikjaywantsonawane@gmail.com

---

*Built with Groq AI (LLaMA 3.3 70B), Pinecone, MongoDB Atlas, and a lot of caffeine.*
