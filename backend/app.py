from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine, SessionLocal, get_db
from utils.qdrant_client import setup_qdrant
from routes import resumes
from routes.auth import router as auth_router
from utils.cleanup import cleanup_expired_temp_resumes
from utils.qdrant_client import setup_qdrant
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

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

    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: cleanup_expired_temp_resumes(SessionLocal()), 'interval', hours=24)
    scheduler.start()

    import atexit
    atexit.register(lambda: scheduler.shutdown(wait=False))

@app.delete("/temp-cleanup")
def delete_expired_temps(db: Session = Depends(get_db)):
    cleanup_expired_temp_resumes(db)
    return {"message": "Expired temporary resumes deleted"}

# ✅ Root route
@app.get("/")
def read_root():
    return {"message": "LinkedIn Talent Finder API is running 🚀"}

app.include_router(auth_router, prefix="/auth")
app.include_router(resumes.router)