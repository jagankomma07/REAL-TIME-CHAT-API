from fastapi import APIRouter
from app.database.mongo import user_collection
from app.core.security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth")

@router.post("/register")
async def register(data: dict):
    data["password"] = hash_password(data["password"])
    await user_collection.insert_one(data)
    return {"msg": "User created"}

@router.post("/login")
async def login(data: dict):
    user = await user_collection.find_one({"email": data["email"]})
    if not user or not verify_password(data["password"], user["password"]):
        return {"error": "Invalid credentials"}

    token = create_token({"user": user["email"]})
    return {"token": token}
