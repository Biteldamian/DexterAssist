from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocket
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.websocket import WebSocketManager
from app.services.chat import ChatService
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],  # Configure this properly in production
)

# WebSocket manager
ws_manager = WebSocketManager()

# Services
llm_service = LLMService()
vector_store = VectorStoreService()
chat_service = ChatService(llm_service, vector_store)

# API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            response = await chat_service.process_message(data)
            await websocket.send_json(response)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await ws_manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    # Initialize services
    await vector_store.initialize()
    await llm_service.initialize()

@app.on_event("shutdown")
async def shutdown_event():
    # Cleanup
    await vector_store.cleanup()
    await llm_service.cleanup()