from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from db import db
from schemas import LoginRequest, SignUpRequest
from utils.jwt import create_access_token
import bcrypt

router = APIRouter()

@router.post("/signup")
async def signup(state: SignUpRequest):
    user = await db["users"].find_one({"email": state.email})
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(state.password.encode(), bcrypt.gensalt()).decode()
    user_data = {
        "name": state.name,
        "email": state.email,
        "number": state.number,
        "password": hashed_pw
    }

    result = await db["users"].insert_one(user_data)
    token = create_access_token({"email": state.email})

    return {"message": "Signup successful", "token": token}

@router.post("/login")
async def login(state: LoginRequest):
    user = await db["users"].find_one({"email": state.email})
    if not user or not bcrypt.checkpw(state.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"email": state.email})
    return {"message": "Login successful", "token": token}
