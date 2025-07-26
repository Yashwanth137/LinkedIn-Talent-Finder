import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from config import settings
from models import Resume
from utils.qdrant_client_wrapper import get_qdrant_client

# === Logger Setup ===
logger = logging.getLogger(__name__)

def cleanup_expired_resumes(db: Session):
    """
    Delete resumes older than 24 hours from both PostgreSQL and Qdrant.
    """
    expiry_threshold = datetime.utcnow() - timedelta(hours=24)

    expired_resumes = db.query(Resume).filter(Resume.created_at < expiry_threshold).all()
    if not expired_resumes:
        logger.info("✅ No expired resumes to clean.")
        return

    for resume in expired_resumes:
        try:
            get_qdrant_client.delete(
                collection_name=settings.qdrant_collection,
                points_selector={"points": [resume.document_id]}
            )
        except Exception as e:
            logger.error(f"❌ Failed to delete vector for {resume.document_id}: {e}")

    try:
        db.query(Resume).filter(Resume.created_at < expiry_threshold).delete(synchronize_session=False)
        db.commit()
        logger.info(f"✅ Cleaned up {len(expired_resumes)} expired resumes.")
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Failed to delete expired resumes from DB: {e}")
