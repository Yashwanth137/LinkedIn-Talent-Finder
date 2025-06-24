from pydantic import BaseModel, EmailStr
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    name: str
    age: int
    number: str
    email: EmailStr
    password: str