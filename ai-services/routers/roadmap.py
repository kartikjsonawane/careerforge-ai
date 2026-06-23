from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import structlog
from agents.orchestrator import orchestrator

router = APIRouter()
logger = structlog.get_logger()

class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    timeframe: str = "12"
    user_id: str = ""

@router.post("/generate")
async def generate_roadmap(request: RoadmapRequest):
    try:
        weeks = int(request.timeframe)
        result = await orchestrator.learning_agent.generate_roadmap(request.target_role, request.current_skills, weeks)
        try:
            data = json.loads(result)
        except:
            import re
            m = re.search(r'```(?:json)?\n?(.*?)\n?```', result, re.DOTALL)
            data = json.loads(m.group(1)) if m else {"raw": result}
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
