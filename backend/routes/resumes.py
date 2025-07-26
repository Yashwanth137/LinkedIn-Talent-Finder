import os
import traceback
from typing import List
import tempfile
import uuid

from sqlalchemy import inspect
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, BackgroundTasks, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy.inspection import inspect
# --- 2. IMPORT REFACTORED UTILS AND CORRECTED SCHEMAS ---
from db import get_db
from models import Resume, UploadJob, TempResume # Import UploadJob model
from schemas import ResumeOut # Use the corrected output schema
from services.upload_backend.upload import process_zip_file_for_api, initialize_vector_db
from services.serach_batch import run_search_pipeline

router = APIRouter()

# Initialize Vector DB on startup
@router.on_event("startup")
def on_startup():
    initialize_vector_db()

# --- 3. REFACTOR UPLOAD TO BE ASYNCHRONOUS ---
@router.post("/upload-resumes")
async def upload_zip(background_tasks: BackgroundTasks, db: Session = Depends(get_db), zipfile: UploadFile = File(...), temporary: bool = Query(False)):
    job = UploadJob(id=str(uuid.uuid4()), status="starting", total_files=0, processed_files=0)
    db.add(job)
    db.commit()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
        tmp.write(await zipfile.read())
        zip_path = tmp.name

    # 🔁 Pass only zip_path and job_id — NOT the db session
    background_tasks.add_task(process_zip_file_for_api, zip_path, job.id, temporary)

    return {"message": "Upload received and is being processed in the background.", "job_id": job.id}

@router.get("/upload-status/{job_id}")
def upload_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(UploadJob).filter(UploadJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id": job.id,
        "status": job.status,
        "processed": job.processed_files,
        "total": job.total_files,
        "done": job.status == "done"
    }

class SearchRequest(BaseModel):
    job_description: str
    top_k: int = 10

class CandidateProfile(ResumeOut): # Inherit from the corrected base schema
    score: float

def get_candidates_from_db(db: Session, doc_ids: List[str]) -> List:
    """
    Helper function to fetch profiles from both TempResume and Resume tables.
    """
    profiles = {p.document_id: p for p in db.query(TempResume).filter(TempResume.document_id.in_(doc_ids)).all()}
    
    # Query the permanent table and add profiles only if they weren't in the temp table
    permanent_profiles = db.query(Resume).filter(Resume.document_id.in_(doc_ids)).all()
    for p in permanent_profiles:
        if p.document_id not in profiles:
            profiles[p.document_id] = p
            
    return list(profiles.values())

@router.post("/search", response_model=List[CandidateProfile])
async def search_resumes(request: SearchRequest, db: Session = Depends(get_db)):
    try:
        search_results = run_search_pipeline(request.job_description, request.top_k)
        if not search_results:
            return []

        doc_ids = [r.id for r in search_results]
        scores_map = {r.id: round(r.score, 2) for r in search_results}

        # --- CHANGE IS HERE ---
        # Use the helper function to query both tables
        profiles_from_db = get_candidates_from_db(db, doc_ids)

        # The rest of your logic for combining scores and creating the response is correct
        response_profiles = []
        for profile in profiles_from_db:
            profile_data = {c.key: getattr(profile, c.key) for c in inspect(profile).mapper.column_attrs}
            profile_data['score'] = scores_map.get(profile.document_id, 0.0)
            email_value = profile_data.get('email')
            if not email_value or email_value == "NA":
                profile_data['email'] = None
            response_profiles.append(CandidateProfile(**profile_data))

        response_profiles.sort(key=lambda p: p.score, reverse=True)
        return response_profiles

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile/{document_id}", response_model=ResumeOut)
async def get_profile(document_id: str, db: Session = Depends(get_db)):
    # 1. Check the TempResume table first
    profile = db.query(TempResume).filter(TempResume.document_id == document_id).first()

    # 2. If not found, check the permanent Resume table
    if not profile:
        profile = db.query(Resume).filter(Resume.document_id == document_id).first()
    
    # 3. If still not found, then it's a 404
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return profile