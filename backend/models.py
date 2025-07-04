from sqlalchemy import Column, Integer, String, Text
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    number = Column(String)
    password = Column(String, nullable=False)


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    text = Column(Text)
