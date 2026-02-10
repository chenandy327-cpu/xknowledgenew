from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, content, groups, events, courses, calendar, checkins
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="x² Knowledge Nebula API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(groups.router, prefix="/api/groups", tags=["groups"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(checkins.router, prefix="/api/checkins", tags=["checkins"])

@app.get("/")
async def root():
    return {"message": "Welcome to x² Knowledge Nebula API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
