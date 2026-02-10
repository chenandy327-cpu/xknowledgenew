from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    name: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class RegisterResponse(BaseModel):
    user_id: str
    email: str
    name: str
