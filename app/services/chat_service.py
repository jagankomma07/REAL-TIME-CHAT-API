from datetime import datetime
from app.database.mongo import message_collection

async def save_message(chat_id: str, user: str, text: str):
    msg = {
        "chat_id": chat_id,
        "sender": user,
        "message": text,
        "timestamp": datetime.utcnow()
    }
    await message_collection.insert_one(msg)
    return msg
