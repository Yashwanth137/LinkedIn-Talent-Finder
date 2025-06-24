from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import db  # assumes you have db.py handling MongoDB connection

app = FastAPI()

# CORS setup for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route to test MongoDB connection
@app.get("/")
async def welcome():
    user = await db["users"].find_one()
    print(user)
    if user and "_id" in user:
        user["_id"] = str(user["_id"])

    return {"message": "MongoDB connected", "sample_user": user}
