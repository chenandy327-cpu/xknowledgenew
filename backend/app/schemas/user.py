from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str
    avatar: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserWithRelations(UserResponse):
    is_following: Optional[bool] = False
    is_friend: Optional[bool] = False
