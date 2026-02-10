from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    cover: Optional[str] = None
    icon: Optional[str] = None

class GroupCreate(GroupBase):
    pass

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    icon: Optional[str] = None

class GroupResponse(GroupBase):
    id: str
    members_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class GroupMemberBase(BaseModel):
    group_id: str
    user_id: str
    is_admin: bool = False

class GroupMemberCreate(GroupMemberBase):
    pass

class GroupMemberResponse(GroupMemberBase):
    id: str
    joined_at: datetime
    
    class Config:
        from_attributes = True
