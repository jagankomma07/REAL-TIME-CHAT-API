from fastapi import FastAPI
from app.routes import auth_routes, chat_routes, websocket_routes

app = FastAPI()

app.include_router(auth_routes.router)
app.include_router(chat_routes.router)
app.include_router(websocket_routes.router)
    