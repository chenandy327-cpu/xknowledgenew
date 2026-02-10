from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.course import CourseResponse, CourseCreate, CourseUpdate, UserCourseResponse, UserCourseCreate, UserCourseUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[CourseResponse])
async def get_courses(
    limit: int = 10,
    offset: int = 0
):
    supabase = supabase_service.get_client()
    courses = supabase.table("courses").select("*").order("created_at", desc=True).limit(limit).offset(offset).execute().data
    
    return courses

@router.get("/mock", response_model=List[dict])
async def get_mock_courses():
    # Return mock courses data
    courses = [
        {"id": "1", "title": "量化分析进阶：模型与风控", "instructor": "Dr. Alan Chen", "progress": 45, "completed": False, "cover": "https://picsum.photos/id/180/400/300"},
        {"id": "2", "title": "UI/UX 深度思维体系", "instructor": "Sarah Wang", "progress": 100, "completed": True, "cover": "https://picsum.photos/id/181/400/300"},
        {"id": "3", "title": "现代物理学基础：量子力学", "instructor": "Prof. Zhao", "progress": 12, "completed": False, "cover": "https://picsum.photos/id/182/400/300"},
    ]
    return courses

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course_by_id(course_id: str):
    supabase = supabase_service.get_client()
    course = supabase.table("courses").select("*").eq("id", course_id).execute().data
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return course[0]

@router.post("/", response_model=CourseResponse)
async def create_course(request: CourseCreate):
    supabase = supabase_service.get_client()
    
    new_course = supabase.table("courses").insert({
        **request.model_dump()
    }).execute().data[0]
    
    return new_course

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(course_id: str, request: CourseUpdate):
    supabase = supabase_service.get_client()
    
    # Check if course exists
    existing_course = supabase.table("courses").select("id").eq("id", course_id).execute().data
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    updated_course = supabase.table("courses").update(
        request.model_dump(exclude_unset=True)
    ).eq("id", course_id).execute().data[0]
    
    return updated_course

@router.delete("/{course_id}")
async def delete_course(course_id: str):
    supabase = supabase_service.get_client()
    
    # Check if course exists
    existing_course = supabase.table("courses").select("id").eq("id", course_id).execute().data
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    supabase.table("courses").delete().eq("id", course_id).execute()
    
    return {"message": "Course deleted successfully"}

@router.get("/user/{user_id}", response_model=List[UserCourseResponse])
async def get_user_courses(user_id: str):
    supabase = supabase_service.get_client()
    user_courses = supabase.table("user_courses").select("*").eq("user_id", user_id).execute().data
    
    return user_courses

@router.post("/enroll", response_model=UserCourseResponse)
async def enroll_course(request: UserCourseCreate):
    supabase = supabase_service.get_client()
    
    # Check if user exists
    existing_user = supabase.table("users").select("id").eq("id", request.user_id).execute().data
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if course exists
    existing_course = supabase.table("courses").select("id").eq("id", request.course_id).execute().data
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if user is already enrolled
    existing_enrollment = supabase.table("user_courses").select("id").eq("user_id", request.user_id).eq("course_id", request.course_id).execute().data
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="User is already enrolled in this course")
    
    # Enroll user
    new_enrollment = supabase.table("user_courses").insert({
        "user_id": request.user_id,
        "course_id": request.course_id,
        "progress": request.progress,
        "completed": request.completed
    }).execute().data[0]
    
    return new_enrollment

@router.put("/progress/{user_course_id}", response_model=UserCourseResponse)
async def update_progress(user_course_id: str, request: UserCourseUpdate):
    supabase = supabase_service.get_client()
    
    # Check if user course exists
    existing_user_course = supabase.table("user_courses").select("id").eq("id", user_course_id).execute().data
    if not existing_user_course:
        raise HTTPException(status_code=404, detail="User course not found")
    
    # Prepare update data
    update_data = request.model_dump(exclude_unset=True)
    
    # If completed is True, set completed_at
    if update_data.get("completed"):
        update_data["completed_at"] = "NOW()"
    
    updated_user_course = supabase.table("user_courses").update(
        update_data
    ).eq("id", user_course_id).execute().data[0]
    
    return updated_user_course

@router.get("/heatmap/{user_id}", response_model=List[int])
async def get_heatmap_data(user_id: str):
    # Return mock heatmap data
    import random
    heatmap_data = [random.randint(0, 4) for _ in range(120)]
    return heatmap_data

@router.post("/heatmap/{user_id}")
async def update_heatmap_data(user_id: str, data: List[int]):
    # In a real app, you would store this data in the database
    # For now, we'll just return a success message
    return {"message": "Heatmap data updated successfully"}
