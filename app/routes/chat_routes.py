from fastapi import APIRouter
from app.database.mongo import message_collection

router = APIRouter(prefix="/chat")

@router.get("/{chat_id}/messages")
async def get_messages(chat_id: str):
    messages = []
    async for m in message_collection.find({"chat_id": chat_id}):
        m["_id"] = str(m["_id"])
        messages.append(m)
    return messages
