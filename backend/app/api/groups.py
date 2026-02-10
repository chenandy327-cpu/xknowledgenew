from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.group import GroupResponse, GroupCreate, GroupUpdate, GroupMemberResponse, GroupMemberCreate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[GroupResponse])
async def get_groups(
    limit: int = 10,
    offset: int = 0,
    sort_by: str = "members_count"
):
    supabase = supabase_service.get_client()
    query = supabase.table("groups").select("*")
    
    if sort_by == "members_count":
        query = query.order("members_count", desc=True)
    elif sort_by == "created_at":
        query = query.order("created_at", desc=True)
    
    groups = query.limit(limit).offset(offset).execute().data
    
    return groups

@router.get("/my", response_model=List[GroupResponse])
async def get_my_groups():
    # Return mock data for my groups
    from datetime import datetime
    current_time = datetime.now().isoformat()
    
    my_groups = [
        {"id": "1", "name": "量子计算研讨会", "members_count": 1200, "icon": "⚡", "created_at": current_time, "updated_at": current_time},
        {"id": "2", "name": "生成式艺术实验室", "members_count": 840, "icon": "🎨", "created_at": current_time, "updated_at": current_time},
        {"id": "3", "name": "现代哲学沙龙", "members_count": 3100, "icon": "🏛️", "created_at": current_time, "updated_at": current_time},
    ]
    return my_groups

@router.get("/{group_id}", response_model=GroupResponse)
async def get_group_by_id(group_id: str):
    supabase = supabase_service.get_client()
    group = supabase.table("groups").select("*").eq("id", group_id).execute().data
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return group[0]

@router.post("/", response_model=GroupResponse)
async def create_group(request: GroupCreate):
    supabase = supabase_service.get_client()
    
    new_group = supabase.table("groups").insert({
        **request.model_dump()
    }).execute().data[0]
    
    return new_group

@router.put("/{group_id}", response_model=GroupResponse)
async def update_group(group_id: str, request: GroupUpdate):
    supabase = supabase_service.get_client()
    
    # Check if group exists
    existing_group = supabase.table("groups").select("id").eq("id", group_id).execute().data
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    updated_group = supabase.table("groups").update(
        request.model_dump(exclude_unset=True)
    ).eq("id", group_id).execute().data[0]
    
    return updated_group

@router.delete("/{group_id}")
async def delete_group(group_id: str):
    supabase = supabase_service.get_client()
    
    # Check if group exists
    existing_group = supabase.table("groups").select("id").eq("id", group_id).execute().data
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    supabase.table("groups").delete().eq("id", group_id).execute()
    
    return {"message": "Group deleted successfully"}

@router.get("/{group_id}/members", response_model=List[GroupMemberResponse])
async def get_group_members(group_id: str):
    supabase = supabase_service.get_client()
    
    # Check if group exists
    existing_group = supabase.table("groups").select("id").eq("id", group_id).execute().data
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    members = supabase.table("group_members").select("*").eq("group_id", group_id).execute().data
    
    return members

@router.post("/{group_id}/members", response_model=GroupMemberResponse)
async def add_group_member(group_id: str, request: GroupMemberCreate):
    supabase = supabase_service.get_client()
    
    # Check if group exists
    existing_group = supabase.table("groups").select("id").eq("id", group_id).execute().data
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check if user exists
    existing_user = supabase.table("users").select("id").eq("id", request.user_id).execute().data
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is already a member
    existing_member = supabase.table("group_members").select("id").eq("group_id", group_id).eq("user_id", request.user_id).execute().data
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this group")
    
    # Add member
    new_member = supabase.table("group_members").insert({
        "group_id": group_id,
        "user_id": request.user_id,
        "is_admin": request.is_admin
    }).execute().data[0]
    
    # Update group members count
    supabase.table("groups").update({
        "members_count": existing_group[0].get("members_count", 0) + 1
    }).eq("id", group_id).execute()
    
    return new_member

@router.delete("/{group_id}/members/{user_id}")
async def remove_group_member(group_id: str, user_id: str):
    supabase = supabase_service.get_client()
    
    # Check if group exists
    existing_group = supabase.table("groups").select("id").eq("id", group_id).execute().data
    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Remove member
    result = supabase.table("group_members").delete().eq("group_id", group_id).eq("user_id", user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="User is not a member of this group")
    
    # Update group members count
    supabase.table("groups").update({
        "members_count": max(0, existing_group[0].get("members_count", 0) - 1)
    }).eq("id", group_id).execute()
    
    return {"message": "Member removed successfully"}
