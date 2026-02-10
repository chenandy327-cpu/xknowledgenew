from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/user/{user_id}", response_model=List[dict])
async def get_user_checkins(user_id: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    supabase = supabase_service.get_client()
    query = supabase.table("checkins").select("*").eq("user_id", user_id)
    
    if start_date:
        query = query.gte("date", start_date)
    if end_date:
        query = query.lte("date", end_date)
    
    checkins = query.order("date", desc=True).execute().data
    
    return checkins

@router.post("/user/{user_id}", response_model=dict)
async def create_checkin(user_id: str, date: str, type: str, content: str, emoji: str):
    supabase = supabase_service.get_client()
    
    # Check if user exists
    existing_user = supabase.table("users").select("id").eq("id", user_id).execute().data
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create checkin
    new_checkin = supabase.table("checkins").insert({
        "user_id": user_id,
        "date": date,
        "type": type,
        "content": content,
        "emoji": emoji
    }).execute().data[0]
    
    return new_checkin

@router.put("/{checkin_id}", response_model=dict)
async def update_checkin(checkin_id: str, content: Optional[str] = None, emoji: Optional[str] = None):
    supabase = supabase_service.get_client()
    
    # Prepare update data
    update_data = {}
    if content:
        update_data["content"] = content
    if emoji:
        update_data["emoji"] = emoji
    
    # Update checkin
    updated_checkin = supabase.table("checkins").update(
        update_data
    ).eq("id", checkin_id).execute().data
    
    if not updated_checkin:
        raise HTTPException(status_code=404, detail="Checkin not found")
    
    return updated_checkin[0]

@router.delete("/{checkin_id}")
async def delete_checkin(checkin_id: str):
    supabase = supabase_service.get_client()
    
    # Delete checkin
    result = supabase.table("checkins").delete().eq("id", checkin_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Checkin not found")
    
    return {"message": "Checkin deleted successfully"}
