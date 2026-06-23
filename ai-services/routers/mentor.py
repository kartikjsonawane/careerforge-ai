"""
AI Mentor Router — RAG-powered career mentoring with user context.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import structlog
from agents.orchestrator import orchestrator
from utils.pinecone_client import semantic_search

router = APIRouter()
logger = structlog.get_logger()


class MentorChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: str
    user_context: Optional[dict] = None


@router.post("/chat")
async def mentor_chat(request: MentorChatRequest):
    """
    RAG-powered mentor chat.
    1. Update user context in agent memory
    2. Semantic search for relevant user documents
    3. Generate contextual response
    """
    try:
        memory = orchestrator.get_memory(request.user_id)

        # Update context if provided
        if request.user_context:
            orchestrator.update_user_context(request.user_id, request.user_context)

        # RAG: Retrieve relevant context from Pinecone
        context_docs = []
        try:
            context_docs = await semantic_search(
                query=request.message,
                user_id=request.user_id,
                top_k=5,
            )
        except Exception as e:
            logger.warning("rag_search_failed", error=str(e))

        # Add user message to memory
        memory.add_message("user", request.message)

        # Generate AI response with context
        response = await orchestrator.mentor_agent.chat(
            message=request.message,
            memory=memory,
            context_docs=context_docs,
        )

        # Add AI response to memory
        memory.add_message("assistant", response)

        return {
            "success": True,
            "response": response,
            "citations": [
                {"title": doc["title"], "source": doc["source"]}
                for doc in context_docs
                if doc.get("score", 0) > 0.7
            ],
            "session_id": request.session_id,
        }
    except Exception as e:
        logger.error("mentor_chat_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/index-document")
async def index_user_document(request: dict):
    """Index a user document (note, certification, project) for RAG retrieval."""
    try:
        from utils.pinecone_client import upsert_documents
        user_id = request.get("user_id")
        documents = request.get("documents", [])

        count = await upsert_documents(user_id=user_id, documents=documents)
        return {"success": True, "indexed": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
