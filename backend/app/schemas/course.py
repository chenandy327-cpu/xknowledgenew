from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CourseBase(BaseModel):
    title: str
    instructor: Optional[str] = None
    cover: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    instructor: Optional[str] = None
    cover: Optional[str] = None

class CourseResponse(CourseBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserCourseBase(BaseModel):
    user_id: str
    course_id: str
    progress: int = 0
    completed: bool = False

class UserCourseCreate(UserCourseBase):
    pass

class UserCourseUpdate(BaseModel):
    progress: Optional[int] = None
    completed: Optional[bool] = None

class UserCourseResponse(UserCourseBase):
    id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
