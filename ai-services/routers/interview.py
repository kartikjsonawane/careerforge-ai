from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import uuid
import structlog
from agents.orchestrator import orchestrator

router = APIRouter()
logger = structlog.get_logger()

class InterviewStartRequest(BaseModel):
    type: str
    role: str
    difficulty: str
    user_id: str = ""

class InterviewAnswerRequest(BaseModel):
    question: str
    answer: str
    interview_type: str
    role: str
    user_id: str = ""

@router.post("/start")
async def start_interview(request: InterviewStartRequest):
    try:
        questions_json = await orchestrator.interview_agent.generate_questions(request.type, request.role, request.difficulty)
        try:
            questions = json.loads(questions_json)
        except:
            questions = []
        session_id = str(uuid.uuid4())
        return {"success": True, "session_id": session_id, "questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{session_id}/respond")
async def respond_to_question(session_id: str, request: InterviewAnswerRequest):
    try:
        evaluation_json = await orchestrator.interview_agent.evaluate_answer(
            request.question, request.answer, request.interview_type, request.role
        )
        try:
            evaluation = json.loads(evaluation_json)
        except:
            evaluation = {"score": 70, "feedback": evaluation_json}
        return {"success": True, "session_id": session_id, "evaluation": evaluation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{session_id}/end")
async def end_interview(session_id: str, request: dict = {}):
    return {"success": True, "session_id": session_id, "status": "completed"}
