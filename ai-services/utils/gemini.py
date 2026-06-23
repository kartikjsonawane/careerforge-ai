"""
Groq AI client — drop-in replacement for Gemini.
Uses the Groq SDK (OpenAI-compatible) with retry logic and prompt management.

Default model : llama-3.3-70b-versatile  (powerful, fast)
Fast model    : llama-3.1-8b-instant      (cheaper, lower-latency tasks)
"""
from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential
import structlog
from typing import Optional
from .config import settings

logger = structlog.get_logger()

# Synchronous Groq client (the SDK handles async via threads)
_client = Groq(api_key=settings.GROQ_API_KEY)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def generate_text(
    prompt: str,
    system_instruction: Optional[str] = None,
    use_flash: bool = False,
    temperature: float = 0.7,
    max_tokens: int = 4096,
) -> str:
    """Generate text using Groq."""
    import asyncio

    model = settings.GROQ_FAST_MODEL if use_flash else settings.GROQ_MODEL

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    try:
        # Run sync Groq call in a thread so we don't block the event loop
        response = await asyncio.to_thread(
            _client.chat.completions.create,
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error("groq_error", error=str(e), model=model)
        raise


async def generate_json(
    prompt: str,
    system_instruction: Optional[str] = None,
    use_flash: bool = False,
) -> str:
    """Generate a JSON response from Groq."""
    json_prompt = (
        f"{prompt}\n\n"
        "Respond ONLY with valid JSON. No markdown code fences, no explanation — just the raw JSON object or array."
    )
    return await generate_text(
        json_prompt,
        system_instruction=system_instruction,
        use_flash=use_flash,
        temperature=0.2,
    )


async def generate_structured(
    prompt: str,
    schema_description: str,
    system_instruction: Optional[str] = None,
) -> str:
    """Generate output that matches a described JSON schema."""
    full_prompt = f"{prompt}\n\nOutput format:\n{schema_description}\n\nReturn ONLY valid JSON matching the format above."
    return await generate_json(full_prompt, system_instruction=system_instruction)


# ─── System instructions for each agent ──────────────────────────────────────
SYSTEM_INSTRUCTIONS = {
    "resume_analyst": (
        "You are an expert ATS specialist and career coach with 15+ years reviewing resumes "
        "for top tech companies. You analyze resumes with precision, identify keyword gaps, "
        "score based on industry standards, and provide actionable improvements. "
        "Be direct and specific. You know what Google, Meta, Amazon, and startups look for."
    ),
    "career_mentor": (
        "You are an experienced senior software engineer and career mentor who has worked at "
        "FAANG and successful startups. You give direct, personalized advice based on the "
        "user's skills, goals, and context. You are encouraging but honest — tell people what "
        "they need to hear, not what they want to hear."
    ),
    "interview_coach": (
        "You are a technical interviewer from a top-tier tech company. You conduct rigorous "
        "but fair interviews across coding (DSA), system design, and behavioral dimensions. "
        "You ask challenging questions, probe for depth, and provide rubric-based scoring on "
        "clarity, technical accuracy, communication, and problem-solving approach."
    ),
    "skill_analyzer": (
        "You are a talent market intelligence specialist with deep expertise in software "
        "engineering job requirements across all major tech companies. You know which skills "
        "are in demand, how requirements differ by tier, and how to prioritize a learning "
        "roadmap for maximum career impact."
    ),
    "project_architect": (
        "You are a senior staff engineer and technical lead who excels at system design and "
        "mentoring engineers through project planning. You design practical, resume-worthy "
        "projects that demonstrate real engineering skills at scale."
    ),
}
