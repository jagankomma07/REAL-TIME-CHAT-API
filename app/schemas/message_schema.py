from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, List[WebSocket]] = {}

    async def connect(self, chat_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(chat_id, []).append(ws)

    def disconnect(self, chat_id: str, ws: WebSocket):
        if chat_id in self.active:
            self.active[chat_id].remove(ws)

    async def broadcast(self, chat_id: str, message: dict):
        for ws in self.active.get(chat_id, []):
            await ws.send_json(message)

manager = ConnectionManager()            


