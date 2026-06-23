from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import structlog
from agents.orchestrator import orchestrator

router = APIRouter()
logger = structlog.get_logger()

class ProjectGenerateRequest(BaseModel):
    skills: List[str]
    difficulty: str = "intermediate"
    interests: List[str] = []
    user_id: str = ""

@router.post("/generate")
async def generate_project(request: ProjectGenerateRequest):
    try:
        result = await orchestrator.project_agent.generate_project(request.skills, request.difficulty, request.interests)
        try:
            data = json.loads(result)
        except:
            import re
            m = re.search(r'```(?:json)?\n?(.*?)\n?```', result, re.DOTALL)
            data = json.loads(m.group(1)) if m else {"raw": result}
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
