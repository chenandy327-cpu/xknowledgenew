from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    cover: Optional[str] = None

class ContentCreate(ContentBase):
    pass

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    cover: Optional[str] = None

class ContentResponse(ContentBase):
    id: str
    author_id: Optional[str] = None
    views: int = 0
    likes: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
