# routes/auth.py
from fastapi import Request
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import LoginRequest, SignUpRequest
from utils.jwt import create_access_token
from models import User
from db import SessionLocal
import bcrypt
from utils.jwt import verify_token

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(state: SignUpRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == state.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    hashed_pw = bcrypt.hashpw(state.password.encode(), bcrypt.gensalt()).decode()
    new_user = User(
        name=state.name,
        email=state.email,
        number=state.number,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"email": state.email})
    return {"message": "Signup successful", "token": token}

@router.post("/login")
def login(state: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == state.email).first()

    if not user or not bcrypt.checkpw(state.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"email": state.email})
    return {"message": "Login successful", "token": token}

@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    print("HEADERS:", request.headers)
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth token")

    token = auth_header.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == payload["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"name": user.name, "email": user.email}