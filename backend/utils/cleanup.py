from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models import TempResume
from qdrant_client import QdrantClient
from config import settings

def cleanup_expired_temp_resumes(db: Session):
    expiry_threshold = datetime.utcnow() - timedelta(hours=24)

    expired = db.query(TempResume).filter(TempResume.created_at < expiry_threshold).all()

    if not expired:
        print("✅ No expired resumes to clean.")
        return

    qdrant = QdrantClient(url=settings.qdrant_host)

    for resume in expired:
        try:
            qdrant.delete(
                collection_name="temp_resumes",
                points_selector={"points": [resume.document_id]}
            )
        except Exception as e:
            print(f"❌ Failed to delete vector for {resume.document_id}: {e}")

    db.query(TempResume).filter(TempResume.created_at < expiry_threshold).delete()
    db.commit()

    print(f"✅ Cleaned up {len(expired)} expired temp resumes.")