from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from services.serach_batch import run_search_pipeline
from db import SessionLocal, get_db
from models import Resume
import traceback
from fastapi.responses import JSONResponse
from fastapi import Path

router = APIRouter()

class SearchRequest(BaseModel):
    job_description: str
    top_k: int = 10

class CandidateProfile(BaseModel):
    document_id: str
    name: str
    email: str
    mobile_number: str
    years_experience: float
    skills: List[str]
    prev_roles: List[str]
    location: str
    score: float

    class Config:
        orm_mode = True

@router.post("/search", response_model=List[CandidateProfile])
async def search_resumes(request: SearchRequest, db: Session = Depends(get_db)):
    try:
        results = run_search_pipeline(request.job_description, request.top_k)

        print("Search results:", results)

        profiles = []
        for r in results:
            print("Looking for profile with document_id:", r.id)  # changed from r.document_id
            profile = db.query(Resume).filter(Resume.document_id == r.id).first()
            if not profile:
                print("Profile not found for:", r.id)
            else:
                profiles.append(CandidateProfile(
                    document_id=r.id,  # changed from r.document_id
                    name=profile.name,
                    email=profile.email,
                    mobile_number=profile.mobile_number,
                    years_experience=profile.years_experience,
                    skills=profile.skills,
                    prev_roles=profile.prev_roles,
                    location=profile.location,
                    score=round(r.score, 2)  # already in percentage
                ))


        return profiles

    except Exception as e:
        print("Error occurred:")
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": str(e)})

@router.get("/profile/{document_id}", response_model=CandidateProfile)
async def get_profile(document_id: str, db: Session = Depends(get_db)):
    profile = db.query(Resume).filter(Resume.document_id == document_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return CandidateProfile(
        document_id=profile.document_id,
        name=profile.name,
        email=profile.email,
        mobile_number=profile.mobile_number,
        years_experience=profile.years_experience,
        skills=profile.skills,
        prev_roles=profile.prev_roles,
        location=profile.location,
        score=0  # Default, or you can pass it from search if needed
    )
