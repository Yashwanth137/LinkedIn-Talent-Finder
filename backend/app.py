from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine
from utils.qdrant_client import setup_qdrant
from routes import resumes
from routes.auth import router as auth_router

app = FastAPI()

# ✅ Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create Postgres tables on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    setup_qdrant()
    print("✅ PostgreSQL tables are set up.")

# ✅ Root route
@app.get("/")
def read_root():
    return {"message": "LinkedIn Talent Finder API is running 🚀"}

app.include_router(auth_router, prefix="/auth")
app.include_router(resumes.router)