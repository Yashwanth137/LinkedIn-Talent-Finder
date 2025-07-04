import uuid
from utils.qdrant_client import client, COLLECTION_NAME
from qdrant_client.http.models import PointStruct

def insert_vector(id: int, vector: list[float], payload: dict):
    point = PointStruct(
        id=id,
        vector=vector,
        payload=payload
    )
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point]
    )

def search_vector(vector: list[float], top_k: int = 5):
    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=top_k
    )
    return results
