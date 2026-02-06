from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        # { chat_id: [ (websocket, user), ... ] }
        self.active_connections = defaultdict(list)

    async def connect(self, chat_id: str, websocket: WebSocket, user: str):
        await websocket.accept()
        self.active_connections[chat_id].append((websocket, user))

    def disconnect(self, chat_id: str, websocket: WebSocket):
        connections = self.active_connections[chat_id]
        for conn in connections:
            if conn[0] == websocket:
                connections.remove(conn)
                break

    async def broadcast(self, chat_id: str, message: str):
        for websocket, _ in self.active_connections[chat_id]:
            await websocket.send_text(message)


manager = ConnectionManager()
