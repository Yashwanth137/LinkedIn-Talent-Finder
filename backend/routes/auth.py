from fastapi import APIRouter
from fastapi.responses import JSONResponse
from db import db
from schemas import LoginRequest, SignUpRequest

router = APIRouter()

@router.post("/login")
async def login(state: LoginRequest):
    user = await db["users"].find_one({"email": state.email})

    if not user or user["password"] != state.password:
        return JSONResponse(content={"message": "Invalid email or password"}, status_code=401)

    user["_id"] = str(user["_id"])
    return JSONResponse(content={"message": "Login successful", "user": user}, status_code=200)

@router.post("/signup")
async def signup(state: SignUpRequest):
    user = await db["users"].find_one({"email": state.email})

    if user:
        return JSONResponse(content={"message": "Email already exists"}, status_code=401)

    user_data = {
        "name": state.name,
        "email": state.email,
        "number": state.number,
        "password": state.password
    }

    result = await db["users"].insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    user_data.pop("password")

    return JSONResponse(content={"message": "User created successfully", "user": user_data}, status_code=201)
