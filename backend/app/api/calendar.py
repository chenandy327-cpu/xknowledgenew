from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/user/{user_id}", response_model=List[dict])
async def get_user_calendar_events(user_id: str):
    supabase = supabase_service.get_client()
    events = supabase.table("calendar_events").select("*").eq("user_id", user_id).execute().data
    
    return events

@router.post("/user/{user_id}", response_model=dict)
async def create_calendar_event(user_id: str, day: int, title: str, type: str = "Personal"):
    supabase = supabase_service.get_client()
    
    # Check if user exists
    existing_user = supabase.table("users").select("id").eq("id", user_id).execute().data
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if event already exists for this day
    existing_event = supabase.table("calendar_events").select("id").eq("user_id", user_id).eq("day", day).execute().data
    if existing_event:
        raise HTTPException(status_code=400, detail="Event already exists for this day")
    
    # Create event
    new_event = supabase.table("calendar_events").insert({
        "user_id": user_id,
        "day": day,
        "title": title,
        "type": type
    }).execute().data[0]
    
    return new_event

@router.put("/user/{user_id}/{day}", response_model=dict)
async def update_calendar_event(user_id: str, day: int, title: str):
    supabase = supabase_service.get_client()
    
    # Update event
    updated_event = supabase.table("calendar_events").update({
        "title": title
    }).eq("user_id", user_id).eq("day", day).execute().data
    
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return updated_event[0]

@router.delete("/user/{user_id}/{day}")
async def delete_calendar_event(user_id: str, day: int):
    supabase = supabase_service.get_client()
    
    # Delete event
    result = supabase.table("calendar_events").delete().eq("user_id", user_id).eq("day", day).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted successfully"}
