from sqlalchemy import Column, Integer, String, Text, Float, ARRAY
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    number = Column(String)
    password = Column(String, nullable=False)


class Resume(Base):
    __tablename__ = "resumes_llm"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    mobile_number = Column(String)
    years_experience = Column(Float)
    skills = Column(ARRAY(Text))         # PostgreSQL array of text
    prev_roles = Column(ARRAY(Text))     # PostgreSQL array of text
    location = Column(Text)