import os
import re
import uuid
import zipfile
import tempfile
import traceback
from pathlib import Path
import json

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from db import SessionLocal
from config import settings  # IMPORTANT: Ensure settings.groq_api_keys is a LIST of your keys
from models import UploadJob, Resume, TempResume

from langchain.prompts import load_prompt
from langchain_groq import ChatGroq
from InstructorEmbedding import INSTRUCTOR
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader

# === SETUP ===
PROMPT_FILE = Path(__file__).parent / "prompt.json"

api_keys = [
    settings.api1,
    settings.api2,  
 ]

qdrant = QdrantClient(url=settings.qdrant_host)
embedder = INSTRUCTOR("hkunlp/instructor-large")
prompt = load_prompt(PROMPT_FILE)
parser = JsonOutputParser()

def initialize_vector_db():
    if not qdrant.collection_exists(settings.qdrant_collection):
        qdrant.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=settings.embedding_dim,
                distance=Distance.COSINE
            )
        )

# === NEW LOGIC FROM save_different_keys.py ===
# This helper function creates the LLM instance.
def create_llm(api_key: str):
    return ChatGroq(model='llama-3.3-70b-versatile', api_key=api_key)

# This is the updated parse_resume function incorporating the key-rotation logic.
def parse_resume(text: str) -> dict:
    """
    Parses resume text using multiple API keys for resilience.
    It tries each key from the settings until one succeeds.
    """
    # Loop through the available API keys from settings.
    for key in api_keys:
        try:
            # Create a new LLM instance with the current key.
            llm = create_llm(key)
            
            # Create the full chain with the JSON parser. This is more robust.
            parser_chain = prompt | llm | parser
            
            # Invoke the chain to get a parsed dictionary directly.
            parsed_data = parser_chain.invoke({"resume_text": text})

            # If we get a valid dictionary, the job is done.
            if isinstance(parsed_data, dict) and parsed_data:
                return parsed_data
            else:
                # If the LLM returns empty or invalid data, log it and try the next key.
                print(f"⚠️ LLM with key {key[:10]}... returned non-dict or empty data. Retrying...")
                continue

        except Exception as e:
            # If an error occurs, check if it's an API key issue.
            error_str = str(e).lower()
            print(f"⚠️ LLM parsing failed with key {key[:10]}...: {e}")
            
            # If it's a token/API key/rate limit error, try the next key.
            if "api key" in error_str or "token" in error_str or "rate limit" in error_str:
                print("   ...API key or rate limit issue. Trying next key.")
                continue  # Move to the next key in the list.
            else:
                # For any other error, stop trying.
                print("   ...Non-retriable error. Stopping parse attempt.")
                break # Exit the loop.

    # If the loop finishes without a successful return, all keys failed.
    print("❌ All API keys failed. Could not parse resume.")
    return {}
# === END OF NEW LOGIC ===

def process_document(db: Session, file_path: str) -> dict:
    filename = os.path.basename(file_path)
    doc_id = str(uuid.uuid4())

    try:
        # Load & clean text
        loader = PyPDFLoader(file_path) if filename.endswith(".pdf") else Docx2txtLoader(file_path)
        pages = loader.load()
        full_text = "\n".join(p.page_content for p in pages)
        full_text = re.sub(r'[\x00-\x1F\x7F]', '', full_text)

        # Parse using the new, robust LLM function
        parsed = parse_resume(full_text)
        if not parsed:
            # This will now only be raised if all API keys fail
            raise ValueError("LLM parsing returned no data.")

        parsed["document_id"] = doc_id  # 🔑 add doc ID manually

        # Store to DB using ORM
        db_resume = Resume(
            document_id=doc_id,
            name=parsed.get("name"),
            email=parsed.get("email", "NA"),
            mobile_number=parsed.get("mobile_number"),
            years_experience=parsed.get("years_experience"),
            skills=parsed.get("skills") or [],
            prev_roles=parsed.get("roles") or [],
            location=parsed.get("location")
        )
        db.merge(db_resume)
        db.commit()

        # Embed & store in Qdrant
        embed_text = f"Skills: {', '.join(db_resume.skills)}\nExperience: {db_resume.years_experience} years\nRoles: {', '.join(db_resume.prev_roles)}"
        vector = embedder.encode([["Represent the resume for job relevance retrieval", embed_text]])[0]

        qdrant.upsert(
            collection_name=settings.qdrant_collection,
            points=[PointStruct(
                id=doc_id,
                vector=vector,
                payload={
                    "document_id": doc_id,
                    "skills": db_resume.skills,
                    "prev_roles": db_resume.prev_roles,
                    "experience": db_resume.years_experience
                }
            )]
        )

        print(f"✅ Processed and stored: {filename}")
        return parsed

    except Exception as e:
        db.rollback()
        print(f"❌ Failed to process {filename}: {e}")
        traceback.print_exc()
        return None


def process_zip_file_for_api(zip_path: str, job_id: str, temporary: bool = False):
    db = SessionLocal()
    try:
        job = db.query(UploadJob).filter(UploadJob.id == job_id).first()
        if not job:
            print(f"❌ No job with ID: {job_id}")
            return

        job.status = "processing"
        db.commit()

        with tempfile.TemporaryDirectory() as temp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            files = [
                os.path.join(temp_dir, f)
                for f in os.listdir(temp_dir)
                if f.lower().endswith((".pdf", ".docx"))
            ]

            job.total_files = len(files)
            if job.total_files == 0:
                job.status = "failed"
                db.commit()
                print("⚠️ No valid files to process.")
                return

            db.commit()
            
            processed_count = 0
            for file_path in files:
                try:
                    parsed_data = process_document(db, file_path)

                    if parsed_data:
                        # FIX: Explicitly create the TempResume object to prevent keyword errors
                        if temporary:
                            resume = TempResume(
                                document_id=parsed_data.get("document_id"),
                                name=parsed_data.get("name"),
                                email=parsed_data.get("email", "NA"),
                                mobile_number=parsed_data.get("mobile_number"),
                                years_experience=parsed_data.get("years_experience"),
                                skills=parsed_data.get("skills") or [],
                                # Map the 'roles' key from the AI to the 'prev_roles' model field
                                prev_roles=parsed_data.get("roles") or [],
                                location=parsed_data.get("location")
                            )
                            db.add(resume)
                            db.commit()
                        
                        processed_count +=1

                except Exception as e:
                    db.rollback()
                    print(f"❌ Failed to process {os.path.basename(file_path)} in job loop: {e}")
                    traceback.print_exc()

            job.processed_files = processed_count
            job.status = "completed" if processed_count == job.total_files else "completed_with_errors"
            db.commit()

            print(f"✅ Upload job {job_id} finished.")

    except Exception as e:
        print(f"❌ Fatal error in background task: {e}")
        traceback.print_exc()
        try:
            job = db.query(UploadJob).filter(UploadJob.id == job_id).first()
            if job and job.status == "processing":
                job.status = "failed"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()