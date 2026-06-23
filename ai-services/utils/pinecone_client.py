"""
Pinecone vector database client for RAG operations.
Handles embeddings, upsert, and semantic search.
"""
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from typing import List, Optional, Dict, Any
import structlog
from .config import settings

logger = structlog.get_logger()

_pc: Optional[Pinecone] = None
_index = None
_embedding_model: Optional[SentenceTransformer] = None


def get_pinecone_index():
    global _pc, _index
    if _index is None:
        _pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        if settings.PINECONE_INDEX_NAME not in [i.name for i in _pc.list_indexes()]:
            _pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=settings.PINECONE_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            logger.info("pinecone_index_created", name=settings.PINECONE_INDEX_NAME)
        _index = _pc.Index(settings.PINECONE_INDEX_NAME)
    return _index


def get_embedding_model() -> SentenceTransformer:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        logger.info("embedding_model_loaded", model=settings.EMBEDDING_MODEL)
    return _embedding_model


def embed_text(text: str) -> List[float]:
    """Generate embedding vector for text."""
    model = get_embedding_model()
    return model.encode(text, normalize_embeddings=True).tolist()


def embed_batch(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of texts."""
    model = get_embedding_model()
    return model.encode(texts, normalize_embeddings=True, batch_size=32).tolist()


async def upsert_documents(
    user_id: str,
    documents: List[Dict[str, Any]],
    namespace: str = "default",
) -> int:
    """Upsert documents with embeddings to Pinecone."""
    index = get_pinecone_index()
    vectors = []
    for doc in documents:
        text = doc.get("text", "")
        if not text:
            continue
        embedding = embed_text(text)
        vectors.append({
            "id": doc["id"],
            "values": embedding,
            "metadata": {
                "user_id": user_id,
                "type": doc.get("type", "general"),
                "title": doc.get("title", ""),
                "text": text[:1000],  # Pinecone metadata limit
                "source": doc.get("source", ""),
                **doc.get("metadata", {}),
            },
        })

    if vectors:
        index.upsert(vectors=vectors, namespace=f"user_{user_id}")
        logger.info("pinecone_upsert", count=len(vectors), user_id=user_id)

    return len(vectors)


async def semantic_search(
    query: str,
    user_id: str,
    top_k: int = 5,
    filter_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Perform semantic search in user's namespace."""
    index = get_pinecone_index()
    query_embedding = embed_text(query)

    filter_dict: Dict[str, Any] = {"user_id": user_id}
    if filter_type:
        filter_dict["type"] = filter_type

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        namespace=f"user_{user_id}",
        filter=filter_dict,
        include_metadata=True,
    )

    return [
        {
            "id": match.id,
            "score": match.score,
            "text": match.metadata.get("text", ""),
            "title": match.metadata.get("title", ""),
            "type": match.metadata.get("type", ""),
            "source": match.metadata.get("source", ""),
        }
        for match in results.matches
    ]


async def delete_user_vectors(user_id: str) -> None:
    """Delete all vectors for a user (GDPR compliance)."""
    index = get_pinecone_index()
    index.delete(delete_all=True, namespace=f"user_{user_id}")
    logger.info("pinecone_delete_user", user_id=user_id)
