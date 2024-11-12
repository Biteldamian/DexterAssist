from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService
from app.services.chat import ChatService

api_key_header = APIKeyHeader(name="X-API-Key")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(api_key: str = Depends(api_key_header)) -> str:
    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    return api_key

def get_llm_service() -> LLMService:
    return LLMService()

def get_vector_store() -> VectorStoreService:
    return VectorStoreService()

def get_chat_service(
    llm: LLMService = Depends(get_llm_service),
    vector_store: VectorStoreService = Depends(get_vector_store),
) -> ChatService:
    return ChatService(llm, vector_store)