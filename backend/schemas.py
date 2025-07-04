# schemas.py

from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    number: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ResumeOut(BaseModel):
    ...
    class Config:
        from_attributes = True
        
class JobDescriptionInput(BaseModel):
    description: str