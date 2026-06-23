"""
CareerForge Multi-Agent Orchestrator
Routes tasks to specialized agents and manages inter-agent communication.

Agents:
  - ResumeAgent: Resume parsing, scoring, ATS analysis
  - SkillAgent: Skill gap analysis, market intelligence
  - MentorAgent: RAG-powered career mentoring
  - InterviewAgent: Interview question generation and evaluation
  - ProjectAgent: Project ideation and architecture design
  - LearningAgent: Roadmap generation and resource curation
"""
from enum import Enum
from typing import Optional, Dict, Any
import structlog
from utils.gemini import generate_text, SYSTEM_INSTRUCTIONS

logger = structlog.get_logger()


class AgentType(str, Enum):
    RESUME = "resume"
    SKILL = "skill"
    MENTOR = "mentor"
    INTERVIEW = "interview"
    PROJECT = "project"
    LEARNING = "learning"


class AgentMemory:
    """Short-term and long-term memory for agents."""

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.short_term: list[Dict[str, Any]] = []  # Current session
        self.context: Dict[str, Any] = {}  # User profile context

    def add_message(self, role: str, content: str) -> None:
        self.short_term.append({"role": role, "content": content})
        # Keep only last 20 messages in short-term
        if len(self.short_term) > 20:
            self.short_term = self.short_term[-20:]

    def set_context(self, key: str, value: Any) -> None:
        self.context[key] = value

    def get_context_summary(self) -> str:
        parts = []
        if self.context.get("target_role"):
            parts.append(f"Target Role: {self.context['target_role']}")
        if self.context.get("current_skills"):
            skills = ", ".join(self.context["current_skills"][:10])
            parts.append(f"Current Skills: {skills}")
        if self.context.get("resume_score"):
            parts.append(f"Resume Score: {self.context['resume_score']}/100")
        if self.context.get("learning_week"):
            parts.append(f"Learning Progress: Week {self.context['learning_week']}")
        return "\n".join(parts) if parts else "No context available"

    def get_conversation_history(self) -> str:
        return "\n".join([f"{m['role'].upper()}: {m['content']}" for m in self.short_term[-10:]])


class BaseAgent:
    """Base class for all CareerForge agents."""

    def __init__(self, name: str, system_instruction_key: str):
        self.name = name
        self.system_instruction = SYSTEM_INSTRUCTIONS.get(system_instruction_key, "")

    async def run(self, prompt: str, memory: Optional[AgentMemory] = None, **kwargs) -> str:
        full_prompt = prompt
        if memory:
            context = memory.get_context_summary()
            history = memory.get_conversation_history()
            if context:
                full_prompt = f"USER CONTEXT:\n{context}\n\nCONVERSATION HISTORY:\n{history}\n\nCURRENT REQUEST:\n{prompt}"
        return await generate_text(full_prompt, system_instruction=self.system_instruction)


class ResumeAgent(BaseAgent):
    def __init__(self):
        super().__init__("ResumeAgent", "resume_analyst")

    async def analyze(self, resume_text: str, job_description: Optional[str] = None) -> str:
        prompt = f"""Analyze this resume comprehensively:

RESUME:
{resume_text}

{f'TARGET JOB DESCRIPTION:{chr(10)}{job_description}' if job_description else ''}

Provide a detailed JSON analysis with:
- overall_score (0-100)
- ats_score (0-100)
- keyword_score (0-100)
- readability_score (0-100)
- impact_score (0-100)
- missing_keywords (list of important missing skills/keywords)
- improvements (list of {{section, issue, suggestion, priority: high/medium/low}})
- strengths (list)
- weaknesses (list)
- summary (brief executive summary)
"""
        return await self.run(prompt)


class SkillAgent(BaseAgent):
    def __init__(self):
        super().__init__("SkillAgent", "skill_analyzer")

    async def analyze_gap(self, current_skills: list[str], target_role: str) -> str:
        prompt = f"""Analyze the skill gap for this user:

Current Skills: {', '.join(current_skills)}
Target Role: {target_role}

Return JSON with:
- current_match_score (0-100): How well current skills match the role
- readiness_score (0-100): Overall readiness
- missing_skills: list of {{name, priority: critical/high/medium/low, demand_score, estimated_learning_time, resources: [{{title, url, type, isFree}}]}}
- present_skills: list of {{name, relevance_score, proficiency_estimate}}
- estimated_time_to_ready: string like "3-4 months"
- priority_learning_path: ordered list of top 5 skills to learn
- market_insights: brief market context for this role
"""
        return await self.run(prompt)


class MentorAgent(BaseAgent):
    def __init__(self):
        super().__init__("MentorAgent", "career_mentor")

    async def chat(self, message: str, memory: AgentMemory, context_docs: list[Dict]) -> str:
        context_text = "\n\n".join([
            f"[{doc['type'].upper()}] {doc['title']}:\n{doc['text']}"
            for doc in context_docs
        ])
        prompt = f"""RETRIEVED CONTEXT FROM USER'S PROFILE:
{context_text if context_text else 'No specific context retrieved.'}

USER MESSAGE:
{message}

Respond as a senior engineer mentor who knows this user's profile deeply. Be direct, specific, and actionable. Reference their actual skills and context when relevant."""
        return await self.run(prompt, memory=memory)


class InterviewAgent(BaseAgent):
    def __init__(self):
        super().__init__("InterviewAgent", "interview_coach")

    async def generate_questions(self, interview_type: str, role: str, difficulty: str, count: int = 5) -> str:
        prompt = f"""Generate {count} {difficulty}-level {interview_type} interview questions for a {role} position.

Return JSON array:
[{{
  "id": "q1",
  "question": "...",
  "type": "{interview_type}",
  "difficulty": "medium",
  "expected_topics": ["topic1", "topic2"],
  "rubric": {{
    "excellent": "...",
    "good": "...",
    "needs_improvement": "..."
  }},
  "follow_ups": ["follow-up question 1", "follow-up question 2"]
}}]"""
        return await self.run(prompt)

    async def evaluate_answer(self, question: str, answer: str, interview_type: str, role: str) -> str:
        prompt = f"""Evaluate this interview answer:

QUESTION: {question}
CANDIDATE ANSWER: {answer}
INTERVIEW TYPE: {interview_type}
ROLE: {role}

Return JSON:
{{
  "score": 0-100,
  "technical_accuracy": 0-100,
  "communication_clarity": 0-100,
  "depth": 0-100,
  "feedback": "specific, constructive feedback",
  "what_was_good": ["point 1", "point 2"],
  "what_to_improve": ["point 1", "point 2"],
  "model_answer_hints": "key points they should have covered"
}}"""
        return await self.run(prompt)


class ProjectAgent(BaseAgent):
    def __init__(self):
        super().__init__("ProjectAgent", "project_architect")

    async def generate_project(self, skills: list[str], difficulty: str, interests: list[str] = []) -> str:
        prompt = f"""Generate a compelling, resume-worthy project idea for a software engineer.

Skills: {', '.join(skills)}
Difficulty: {difficulty}
Interests: {', '.join(interests) if interests else 'General software engineering'}

Return detailed JSON:
{{
  "title": "...",
  "description": "...",
  "difficulty": "{difficulty}",
  "estimated_duration": "X weeks",
  "tech_stack": [...],
  "features": [...],
  "architecture": {{
    "overview": "...",
    "components": [{{"name": "...", "description": "...", "technology": "..."}}]
  }},
  "api_design": [{{"method": "GET/POST/...", "path": "/...", "description": "..."}}],
  "database_schema": {{
    "collections": [{{"name": "...", "fields": [{{"name": "...", "type": "...", "required": true}}]}}]
  }},
  "resume_bullet_points": ["...", "..."],
  "learning_outcomes": ["...", "..."],
  "deployment_guide": "brief deployment instructions"
}}"""
        return await self.run(prompt)


class LearningAgent(BaseAgent):
    def __init__(self):
        super().__init__("LearningAgent", "skill_analyzer")

    async def generate_roadmap(self, target_role: str, current_skills: list[str], weeks: int = 12) -> str:
        prompt = f"""Create a detailed {weeks}-week learning roadmap:

Target Role: {target_role}
Current Skills: {', '.join(current_skills)}
Duration: {weeks} weeks

Return JSON:
{{
  "target_role": "{target_role}",
  "total_weeks": {weeks},
  "overview": "...",
  "weeks": [{{
    "week_number": 1,
    "theme": "...",
    "goals": ["...", "..."],
    "resources": [{{"title": "...", "url": "...", "type": "course/book/article", "provider": "...", "duration": "Xh", "is_free": true}}],
    "projects": ["mini project idea"],
    "estimated_hours": 15,
    "milestones": ["milestone if applicable"]
  }}],
  "milestones": [{{"title": "...", "week_number": X, "description": "..."}}],
  "certifications": [{{"name": "...", "provider": "...", "relevant_by_week": X}}]
}}"""
        return await self.run(prompt)


class AgentOrchestrator:
    """Main orchestrator that routes requests to appropriate agents."""

    def __init__(self):
        self.resume_agent = ResumeAgent()
        self.skill_agent = SkillAgent()
        self.mentor_agent = MentorAgent()
        self.interview_agent = InterviewAgent()
        self.project_agent = ProjectAgent()
        self.learning_agent = LearningAgent()
        self._memories: Dict[str, AgentMemory] = {}

    def get_memory(self, user_id: str) -> AgentMemory:
        if user_id not in self._memories:
            self._memories[user_id] = AgentMemory(user_id)
        return self._memories[user_id]

    def update_user_context(self, user_id: str, context: Dict[str, Any]) -> None:
        memory = self.get_memory(user_id)
        for key, value in context.items():
            memory.set_context(key, value)


# Singleton orchestrator
orchestrator = AgentOrchestrator()
