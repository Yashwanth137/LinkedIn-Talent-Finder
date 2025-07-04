# routes/resumes.py
'''
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Resume
from schemas import ResumeOut, JobDescriptionInput
from services.parser import extract_text_from_pdf
from services.embedder import generate_embedding
from utils.matcher import insert_vector, search_similar
import uuid

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload", response_model=dict)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    text = extract_text_from_pdf(content)
    embedding = generate_embedding(text)
    resume_uuid = str(uuid.uuid4())

    resume = Resume(uuid=resume_uuid, name="", email="", text=text)
    db.add(resume)
    db.commit()
    db.refresh(resume)

    insert_vector(resume.id, embedding, {"uuid": resume_uuid})

    return {"message": "Resume uploaded", "id": resume.id}

@router.post("/search", response_model=List[ResumeOut])
async def search_resumes(job: JobDescriptionInput, db: Session = Depends(get_db)):
    vector = generate_embedding(job.description)
    ids = search_similar(vector)

    results = db.query(Resume).filter(Resume.id.in_(ids)).all()
    return [
        ResumeOut(
            id=r.id,
            uuid=r.uuid,
            name=r.name,
            email=r.email,
            text_snippet=r.text[:200]
        ) for r in results
    ]
'''