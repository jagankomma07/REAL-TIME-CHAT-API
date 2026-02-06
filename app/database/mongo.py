from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["chat_app"]

user_collection = db["users"]
message_collection = db["messages"]

from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["chat_app"]

users_collection = db["users"]
messages_collection = db["messages"]
 