import os
import time
import json
from typing import List
from pydantic import BaseModel, Field
from InstructorEmbedding import INSTRUCTOR
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from langchain.output_parsers import StructuredOutputParser
from langchain.prompts import load_prompt
from langchain_groq import ChatGroq
from langchain.output_parsers import PydanticOutputParser

# === CONFIG ===
QDRANT_COLLECTION = "llm_qdrant_llm"
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333
GROQ_MODEL = "llama-3.3-70b-versatile"
BATCH_SIZE = 20

# === Pydantic Schema for Output ===
class CandidateScore(BaseModel):
    id: str = Field(description="The document ID of the candidate")
    score: int = Field(ge=1, le=100, description="Match score from 1 to 100")

class CandidateScores(BaseModel):
    results: List[CandidateScore]

parser = PydanticOutputParser(pydantic_object=CandidateScores)

# === Load structured prompt ===
current_dir = os.path.dirname(os.path.abspath(__file__))
prompt_path = os.path.join(current_dir, "structured_ranking_prompt.json")
prompt = load_prompt(prompt_path)

llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY", "api")
)

chain = prompt | llm | parser

# === Qdrant and Embedding Setup ===
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
embedder = INSTRUCTOR("hkunlp/instructor-large")

def run_search_pipeline(job_description: str, top_k: int = 10) -> List[CandidateScore]:
    query_instruction = "Represent the job description for matching resumes:"
    query_vector = embedder.encode([[query_instruction, job_description]])[0].tolist()

    search_results = qdrant.query_points(
        collection_name=QDRANT_COLLECTION,
        query=query_vector,
        score_threshold=0.55,
        with_payload=True,
        limit=50,
    ).points

    candidate_payloads = [
        {
            "id": p.payload.get("document_id"),
            "skills": p.payload.get("skills", []),
            "roles": p.payload.get("roles", []),
            "experience": p.payload.get("experience", 0),
        }
        for p in search_results
        if p.payload and p.payload.get("document_id")
    ]

    all_ranked = []

    for i in range(0, len(candidate_payloads), BATCH_SIZE):
        batch = candidate_payloads[i:i + BATCH_SIZE]
        try:
            result = chain.invoke({
                "job_description": job_description,
                "candidates": json.dumps(batch),
                "format_instructions": parser.get_format_instructions()
            })
            all_ranked.extend(result.results)
        except Exception as e:
            print(f"⚠️ Batch {i//BATCH_SIZE + 1} failed: {e}")

    return sorted(all_ranked, key=lambda x: x.score, reverse=True)[:top_k]
