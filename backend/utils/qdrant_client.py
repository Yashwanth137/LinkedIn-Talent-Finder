from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from config import settings  # assuming settings.embedding_dim is defined

client = QdrantClient(host="localhost", port=6333)

COLLECTION_NAME = "resume_vectors"

def setup_qdrant():
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=settings.embedding_dim,  # e.g., 384
                distance=Distance.COSINE,
            )
        )
