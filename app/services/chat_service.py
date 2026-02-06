from app.database.mongo import messages_collection
from datetime import datetime

async def save_message(chat_id, user, message):
    await messages_collection.insert_one({
        "chat_id": chat_id,
        "user": user,
        "message": message,
        "timestamp": datetime.utcnow()
    })


async def get_chat_history(chat_id):
    cursor = messages_collection.find(
        {"chat_id": chat_id}
    ).sort("timestamp", 1)

    messages = await cursor.to_list(length=1000)
    return messages
