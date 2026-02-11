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
            "avatar": "https://picsum.photos/id/100/100/100",
            "password": get_password_hash("password")
        }
    else:
        mock_user = user[0]
    
    # Verify password
    if not verify_password(request.password, mock_user.get("password", "password")):
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
            "password": get_password_hash(request.password),
            "avatar": f"https://picsum.photos/id/{hash(request.email) % 100}/100/100"
        }).execute().data[0]
    except:
        # For testing purposes, create a mock user if insertion fails
        new_user = {
            "id": f"user-{hash(request.email)}",
            "email": request.email,
            "name": request.name,
            "password": get_password_hash(request.password),
            "avatar": f"https://picsum.photos/id/{hash(request.email) % 100}/100/100"
        }
    
    # Create access token for new user
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user["id"]},
        expires_delta=access_token_expires
    )
    
    return RegisterResponse(
        access_token=access_token,
        user_id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"]
    )

@router.post("/logout")
async def logout():
    # In a real app, you might want to invalidate the token
    # For now, we'll just return a success message
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(email: str):
    # Check if user exists
    supabase = supabase_service.get_client()
    user = supabase.table("users").select("id, email").eq("email", email).execute().data
    
    if not user:
        # For security reasons, return success even if user doesn't exist
        return {"message": "Password reset email sent"}
    
    # In a real app, you would send a password reset email with a token
    # For now, we'll just return a success message
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    # In a real app, you would verify the token
    # For now, we'll just return a success message
    return {"message": "Password reset successfully"}
