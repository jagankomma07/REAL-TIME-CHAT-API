from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # { chat_id: { user: websocket } }
        self.active_connections = {}

    async def connect(self, chat_id: str, user: str, websocket: WebSocket):
        await websocket.accept()

        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = {}

        self.active_connections[chat_id][user] = websocket

    def disconnect(self, chat_id: str, user: str):
        if chat_id in self.active_connections:
            self.active_connections[chat_id].pop(user, None)

    async def broadcast(self, chat_id: str, message: dict):
        if chat_id in self.active_connections:
            for ws in self.active_connections[chat_id].values():
                await ws.send_json(message)
