from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import structlog
from agents.orchestrator import orchestrator

router = APIRouter()
logger = structlog.get_logger()

class SkillAnalyzeRequest(BaseModel):
    current_skills: List[str]
    target_role: str
    user_id: str = ""

@router.post("/analyze")
async def analyze_skill_gap(request: SkillAnalyzeRequest):
    try:
        result = await orchestrator.skill_agent.analyze_gap(request.current_skills, request.target_role)
        try:
            data = json.loads(result)
        except:
            import re
            m = re.search(r'```(?:json)?\n?(.*?)\n?```', result, re.DOTALL)
            data = json.loads(m.group(1)) if m else {"raw": result}
        return {"success": True, "data": data}
    except Exception as e:
        logger.error("skill_analyze_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
