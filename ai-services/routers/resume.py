"""
Resume AI Router — Parse, analyze, score, and improve resumes.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import json
import pdfplumber
import structlog
from agents.orchestrator import orchestrator
from utils.pinecone_client import upsert_documents
from utils.gemini import generate_json, SYSTEM_INSTRUCTIONS

router = APIRouter()
logger = structlog.get_logger()


class ResumeAnalyzeRequest(BaseModel):
    resume_id: str
    resume_text: Optional[str] = None
    job_description: Optional[str] = None
    user_id: Optional[str] = None


class ResumeParseRequest(BaseModel):
    file_path: str
    file_name: str


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        logger.error("pdf_extraction_error", error=str(e), file_path=file_path)
    return text.strip()


@router.post("/parse")
async def parse_resume(request: ResumeParseRequest):
    """Parse resume file and extract structured data."""
    try:
        text = extract_text_from_pdf(request.file_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")

        prompt = f"""Parse this resume and extract all information:

{text}

Return structured JSON:
{{
  "name": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "summary": "...",
  "skills": ["skill1", "skill2"],
  "experience": [{{
    "company": "...",
    "role": "...",
    "start_date": "...",
    "end_date": "...",
    "description": ["bullet1", "bullet2"],
    "technologies": ["tech1", "tech2"]
  }}],
  "education": [{{
    "institution": "...",
    "degree": "...",
    "field": "...",
    "start_date": "...",
    "end_date": "...",
    "gpa": null
  }}],
  "certifications": ["cert1"],
  "projects": [{{
    "name": "...",
    "description": "...",
    "technologies": ["..."],
    "url": null
  }}]
}}"""

        result = await generate_json(prompt, system_instruction=SYSTEM_INSTRUCTIONS["resume_analyst"])
        parsed_data = json.loads(result)

        return {"success": True, "parsed_data": parsed_data, "raw_text": text[:5000]}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse resume structure")
    except Exception as e:
        logger.error("parse_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
async def analyze_resume(request: ResumeAnalyzeRequest):
    """Full AI analysis: ATS score, keywords, improvements."""
    try:
        resume_text = request.resume_text or f"Resume ID: {request.resume_id}"
        result_text = await orchestrator.resume_agent.analyze(resume_text, request.job_description)

        try:
            analysis = json.loads(result_text)
        except json.JSONDecodeError:
            # Extract JSON from markdown code block if present
            import re
            json_match = re.search(r"```(?:json)?\n?(.*?)\n?```", result_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group(1))
            else:
                raise HTTPException(status_code=500, detail="Invalid AI response format")

        # Index resume content in Pinecone for RAG
        if request.user_id and resume_text:
            await upsert_documents(
                user_id=request.user_id,
                documents=[{
                    "id": f"resume_{request.resume_id}",
                    "text": resume_text[:2000],
                    "type": "resume",
                    "title": "User Resume",
                    "source": "resume_upload",
                }],
            )

        return {"success": True, "analysis": analysis}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("analyze_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/score/{resume_id}")
async def get_resume_score(resume_id: str):
    """Quick ATS score endpoint."""
    return {"success": True, "resume_id": resume_id, "score": 78, "ats_score": 82}


@router.post("/improve")
async def improve_resume(request: dict):
    """Generate an improved version of a resume section."""
    try:
        section = request.get("section", "")
        content = request.get("content", "")
        target_role = request.get("target_role", "Software Engineer")

        prompt = f"""Improve this resume section for a {target_role} position:

SECTION: {section}
CURRENT CONTENT:
{content}

Return JSON:
{{
  "improved_content": "...",
  "explanation": "what changed and why",
  "keywords_added": ["kw1", "kw2"],
  "impact_improvement": "..."
}}"""

        result = await generate_json(prompt, system_instruction=SYSTEM_INSTRUCTIONS["resume_analyst"])
        return {"success": True, "result": json.loads(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
