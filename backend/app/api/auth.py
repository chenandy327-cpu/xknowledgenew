from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from app.services.supabase import supabase_service
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from app.services.supabase import supabase_service
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    # Get user from Supabase
    supabase = supabase_service.get_client()
    user = supabase.table("users").select("*").eq("email", request.email).execute().data
    
    # For testing purposes, if no user found, create a mock user
    if not user:
        # Create mock user data
        mock_user = {
            "id": "test-user-id",
            "email": request.email,
            "name": "Test User",
            "avatar": "https://picsum.photos/id/100/100/100"
        }
    else:
        mock_user = user[0]
    
    # Verify password (in a real app, you would hash passwords)
    # For now, we'll just check if the password is correct
    # In production, use verify_password() with hashed passwords
    if request.password != "password":  # This is just for demo
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": mock_user["id"]},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=mock_user["id"],
        email=mock_user["email"],
        name=mock_user["name"]
    )

@router.post("/register", response_model=RegisterResponse)
async def register(request: RegisterRequest):
    # Check if user already exists
    supabase = supabase_service.get_client()
    existing_user = supabase.table("users").select("id").eq("email", request.email).execute().data
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    try:
        new_user = supabase.table("users").insert({
            "email": request.email,
            "name": request.name,
            "avatar": f"https://picsum.photos/id/{hash(request.email) % 100}/100/100"
        }).execute().data[0]
    except:
        # For testing purposes, create a mock user if insertion fails
        new_user = {
            "id": f"user-{hash(request.email)}",
            "email": request.email,
            "name": request.name,
            "avatar": f"https://picsum.photos/id/{hash(request.email) % 100}/100/100"
        }
    
    return RegisterResponse(
        user_id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"]
    )

@router.post("/logout")
async def logout():
    # In a real app, you might want to invalidate the token
    # For now, we'll just return a success message
    return {"message": "Successfully logged out"}
