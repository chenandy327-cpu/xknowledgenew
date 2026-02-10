from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.event import EventResponse, EventCreate, EventUpdate, UserEventResponse, UserEventCreate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[EventResponse])
async def get_events(
    category: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
):
    supabase = supabase_service.get_client()
    query = supabase.table("events").select("*")
    
    if category:
        query = query.eq("category", category)
    
    events = query.order("created_at", desc=True).limit(limit).offset(offset).execute().data
    
    return events

@router.get("/mock", response_model=List[dict])
async def get_mock_events():
    # Return mock events data
    events = [
        {"id": "1", "title": "x²年度跨界知识论坛", "dist": 1.2, "cat": "学术会议", "date": "11月11日", "cover": "https://picsum.photos/id/111/400/300"},
        {"id": "2", "title": "\"数字之境\"光影艺术展", "dist": 3.5, "cat": "艺术展览", "date": "11月15日", "cover": "https://picsum.photos/id/122/400/300"},
        {"id": "3", "title": "独立创作者交流周", "dist": 0.8, "cat": "同城聚会", "date": "11月20日", "cover": "https://picsum.photos/id/133/400/300"},
    ]
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def get_event_by_id(event_id: str):
    supabase = supabase_service.get_client()
    event = supabase.table("events").select("*").eq("id", event_id).execute().data
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event[0]

@router.post("/", response_model=EventResponse)
async def create_event(request: EventCreate):
    supabase = supabase_service.get_client()
    
    new_event = supabase.table("events").insert({
        **request.model_dump()
    }).execute().data[0]
    
    return new_event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, request: EventUpdate):
    supabase = supabase_service.get_client()
    
    # Check if event exists
    existing_event = supabase.table("events").select("id").eq("id", event_id).execute().data
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    updated_event = supabase.table("events").update(
        request.model_dump(exclude_unset=True)
    ).eq("id", event_id).execute().data[0]
    
    return updated_event

@router.delete("/{event_id}")
async def delete_event(event_id: str):
    supabase = supabase_service.get_client()
    
    # Check if event exists
    existing_event = supabase.table("events").select("id").eq("id", event_id).execute().data
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    supabase.table("events").delete().eq("id", event_id).execute()
    
    return {"message": "Event deleted successfully"}

@router.get("/user/{user_id}", response_model=List[UserEventResponse])
async def get_user_events(user_id: str):
    supabase = supabase_service.get_client()
    user_events = supabase.table("user_events").select("*").eq("user_id", user_id).execute().data
    
    return user_events

@router.post("/book", response_model=UserEventResponse)
async def book_event(request: UserEventCreate):
    supabase = supabase_service.get_client()
    
    # Check if user exists
    existing_user = supabase.table("users").select("id").eq("id", request.user_id).execute().data
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if event exists
    existing_event = supabase.table("events").select("id").eq("id", request.event_id).execute().data
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user has already booked this event
    existing_booking = supabase.table("user_events").select("id").eq("user_id", request.user_id).eq("event_id", request.event_id).execute().data
    if existing_booking:
        raise HTTPException(status_code=400, detail="User has already booked this event")
    
    # Book event
    new_booking = supabase.table("user_events").insert({
        "user_id": request.user_id,
        "event_id": request.event_id
    }).execute().data[0]
    
    return new_booking

@router.delete("/book/{user_id}/{event_id}")
async def cancel_booking(user_id: str, event_id: str):
    supabase = supabase_service.get_client()
    
    # Cancel booking
    result = supabase.table("user_events").delete().eq("user_id", user_id).eq("event_id", event_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking cancelled successfully"}
