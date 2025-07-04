from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    postgres_url: str
    qdrant_host: str = "http://localhost:6333"
    embedding_dim: int = 384

    class Config:
        env_file = ".env"

settings = Settings()
