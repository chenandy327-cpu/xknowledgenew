from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.content import ContentResponse, ContentCreate, ContentUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[ContentResponse])
async def get_content(
    category: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    sort_by: str = "created_at"
):
    supabase = supabase_service.get_client()
    query = supabase.table("content").select("*")
    
    if category:
        query = query.eq("category", category)
    
    if sort_by == "views":
        query = query.order("views", desc=True)
    elif sort_by == "likes":
        query = query.order("likes", desc=True)
    else:
        query = query.order("created_at", desc=True)
    
    content = query.limit(limit).offset(offset).execute().data
    
    return content

@router.get("/hotspots", response_model=List[dict])
async def get_hotspots():
    # Return mock hotspots data
    hotspots = [
        {"name": "量子计算", "top": "25%", "left": "30%", "color": "#a855f7"},
        {"name": "生成式AI", "top": "45%", "left": "60%", "color": "#7f13ec"},
        {"name": "神经网络", "top": "65%", "left": "35%", "color": "#3b82f6"},
        {"name": "艺术哲学", "top": "15%", "left": "55%", "color": "#ec4899"},
        {"name": "数字孪生", "top": "75%", "left": "55%", "color": "#3b82f6"},
        {"name": "脑机接口", "top": "35%", "left": "15%", "color": "#f59e0b"},
    ]
    return hotspots

@router.get("/hot-chats", response_model=List[dict])
async def get_hot_chats():
    # Return mock hot chats data
    hot_chats = [
        {"id": 1, "topic": "DeepSeek-R1 的推理逻辑", "count": "1.2w", "trend": "up"},
        {"id": 2, "topic": "碳基与硅基生命的边界", "count": "8.4k", "trend": "up"},
        {"id": 3, "topic": "空间计算中的交互革命", "count": "6.2k", "trend": "steady"},
        {"id": 4, "topic": "从原子到比特：物质数字化", "count": "4.8k", "trend": "up"},
        {"id": 5, "topic": "后人类主义下的艺术创作", "count": "3.1k", "trend": "new"},
    ]
    return hot_chats

@router.get("/{content_id}", response_model=ContentResponse)
async def get_content_by_id(content_id: str):
    supabase = supabase_service.get_client()
    content = supabase.table("content").select("*").eq("id", content_id).execute().data
    
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return content[0]

@router.post("/", response_model=ContentResponse)
async def create_content(request: ContentCreate):
    supabase = supabase_service.get_client()
    
    # Get first user as author
    user = supabase.table("users").select("id").limit(1).execute().data
    author_id = user[0]["id"] if user else None
    
    new_content = supabase.table("content").insert({
        **request.model_dump(),
        "author_id": author_id
    }).execute().data[0]
    
    return new_content

@router.put("/{content_id}", response_model=ContentResponse)
async def update_content(content_id: str, request: ContentUpdate):
    supabase = supabase_service.get_client()
    
    # Check if content exists
    existing_content = supabase.table("content").select("id").eq("id", content_id).execute().data
    if not existing_content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    updated_content = supabase.table("content").update(
        request.model_dump(exclude_unset=True)
    ).eq("id", content_id).execute().data[0]
    
    return updated_content

@router.delete("/{content_id}")
async def delete_content(content_id: str):
    supabase = supabase_service.get_client()
    
    # Check if content exists
    existing_content = supabase.table("content").select("id").eq("id", content_id).execute().data
    if not existing_content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    supabase.table("content").delete().eq("id", content_id).execute()
    
    return {"message": "Content deleted successfully"}
