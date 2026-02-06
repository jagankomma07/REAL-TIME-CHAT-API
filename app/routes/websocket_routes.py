import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.connection_manager import ConnectionManager 
from app.services.chat_service import save_message, get_chat_history

router = APIRouter()
manager = ConnectionManager()


@router.websocket("/ws/{chat_id}/{user}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str, user: str):
    await manager.connect(chat_id, user, websocket)


    history = await get_chat_history(chat_id)
    for msg in history:
        await websocket.send_json({
            "user": msg["user"],
            "message": msg["message"]
        })

    try:
        while True:
            message = await websocket.receive_text()

            # Save to MongoDB
            await save_message(chat_id, user, message)

            # Broadcast
            await manager.broadcast(chat_id, {
                "user": user,
                "message": message
            })

    except WebSocketDisconnect:
        manager.disconnect(chat_id, user)
