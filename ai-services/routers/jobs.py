from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import structlog
from utils.gemini import generate_json, SYSTEM_INSTRUCTIONS
import json

router = APIRouter()
logger = structlog.get_logger()

class JobMatchRequest(BaseModel):
    resume_id: str
    skills: List[str] = []
    target_role: Optional[str] = None
    user_id: str = ""

@router.post("/match")
async def match_jobs(request: JobMatchRequest):
    try:
        prompt = f"""Generate 6 realistic job matches for a candidate with these skills: {', '.join(request.skills)}
Target role: {request.target_role or 'Software Engineer'}

Return JSON array of job matches:
[{{
  "id": "j1",
  "title": "...",
  "company": "...",
  "location": "...",
  "type": "Full-time",
  "salary_min": 150000,
  "salary_max": 200000,
  "match_score": 85,
  "matched_skills": ["...", "..."],
  "missing_skills": ["...", "..."],
  "url": "https://...",
  "description": "Brief role description",
  "posted_at": "2 days ago"
}}]"""
        result = await generate_json(prompt)
        data = json.loads(result)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
