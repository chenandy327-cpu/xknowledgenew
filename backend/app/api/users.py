from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.user import UserResponse, UserUpdate, UserWithRelations
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user():
    # In a real app, you would get the user from the JWT token
    # For now, we'll return a mock user
    supabase = supabase_service.get_client()
    user = supabase.table("users").select("*").limit(1).execute().data
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user[0]

@router.get("/{user_id}", response_model=UserWithRelations)
async def get_user(user_id: str):
    supabase = supabase_service.get_client()
    user = supabase.table("users").select("*").eq("id", user_id).execute().data
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add mock relations data
    user_with_relations = user[0]
    user_with_relations["is_following"] = False
    user_with_relations["is_friend"] = False
    
    return user_with_relations

@router.put("/me", response_model=UserResponse)
async def update_current_user(request: UserUpdate):
    # In a real app, you would get the user from the JWT token
    # For now, we'll update the first user
    supabase = supabase_service.get_client()
    user = supabase.table("users").select("id").limit(1).execute().data
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user[0]["id"]
    
    # Update user
    updated_user = supabase.table("users").update(
        request.model_dump(exclude_unset=True)
    ).eq("id", user_id).execute().data[0]
    
    return updated_user

@router.get("/", response_model=List[UserWithRelations])
async def get_users(limit: int = 10, offset: int = 0):
    supabase = supabase_service.get_client()
    users = supabase.table("users").select("*").limit(limit).offset(offset).execute().data
    
    # Add mock relations data
    for user in users:
        user["is_following"] = False
        user["is_friend"] = False
    
    return users
