from typing import List, Optional
from app.core.config import settings
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService
from app.schemas.chat import Message, ChatResponse

class ChatService:
    def __init__(
        self,
        llm_service: LLMService,
        vector_store: VectorStoreService,
    ):
        self.llm = llm_service
        self.vector_store = vector_store

    async def process_message(self, message: Message) -> ChatResponse:
        # Get relevant context from vector store
        context = await self.vector_store.search_similar(message.content)
        
        # Generate response using LLM
        response = await self.llm.generate_response(
            message.content,
            context=context
        )
        
        return ChatResponse(
            content=response,
            role="assistant",
            context_documents=context
        )