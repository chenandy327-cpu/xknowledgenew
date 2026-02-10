from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "x² Knowledge Nebula"
    DEBUG: bool = True
    
    # Supabase settings
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # JWT settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
