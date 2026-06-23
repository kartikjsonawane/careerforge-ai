"""
CareerForge AI Services — FastAPI Application
Multi-agent AI system with RAG, Gemini, and Pinecone
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import structlog
import time

from routers import resume, skills, roadmap, mentor, interview, projects, jobs
from utils.config import settings

logger = structlog.get_logger()

app = FastAPI(
    title="CareerForge AI Services",
    description="Multi-agent AI system powering CareerForge — Resume Analysis, RAG Mentor, Interview Coach, Skill Gap Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── Middleware ───────────────────────────────────────────────────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, settings.BACKEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info("request", method=request.method, path=request.url.path, status=response.status_code, duration_ms=duration)
    return response

# ─── Exception Handler ────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_error", path=request.url.path, error=str(exc))
    return JSONResponse(status_code=500, content={"success": False, "error": "Internal AI service error"})

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(resume.router, prefix="/resume", tags=["Resume AI"])
app.include_router(skills.router, prefix="/skills", tags=["Skill Analysis"])
app.include_router(roadmap.router, prefix="/roadmap", tags=["Learning Roadmap"])
app.include_router(mentor.router, prefix="/mentor", tags=["AI Mentor"])
app.include_router(interview.router, prefix="/interview", tags=["Interview Coach"])
app.include_router(projects.router, prefix="/projects", tags=["Project Lab"])
app.include_router(jobs.router, prefix="/jobs", tags=["Job Matching"])

# ─── Health ───────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "careerforge-ai", "version": "1.0.0"}

@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CareerForge AI Services",
        "endpoints": ["/resume", "/skills", "/roadmap", "/mentor", "/interview", "/projects", "/jobs"],
        "docs": "/docs",
    }
