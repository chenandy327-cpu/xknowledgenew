from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    category: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    distance: Optional[float] = None
    cover: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    distance: Optional[float] = None
    cover: Optional[str] = None

class EventResponse(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserEventBase(BaseModel):
    user_id: str
    event_id: str

class UserEventCreate(UserEventBase):
    pass

class UserEventResponse(UserEventBase):
    id: str
    booked_at: datetime
    
    class Config:
        from_attributes = True
