from typing import List, Optional
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.schemas.chat import Message, ChatResponse
from app.services.chat import ChatService
from app.core.deps import get_current_user

router = APIRouter()

@router.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    chat_service: ChatService = Depends(),
):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            response = await chat_service.process_message(data)
            await websocket.send_json(response)
    except WebSocketDisconnect:
        pass

@router.post("/messages", response_model=ChatResponse)
async def send_message(
    message: Message,
    chat_service: ChatService = Depends(),
    current_user = Depends(get_current_user),
) -> ChatResponse:
    return await chat_service.process_message(message)