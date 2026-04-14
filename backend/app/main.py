from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import init_db, close_db
from app.routes import auth, sensors, advice, weather, notifications, resources, dashboard, knowledge


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    await init_db()
    print("[OK] Database initialized")

    # Initialize RAG knowledge base (OPTIONAL - disabled for speed)
    # RAG is available on-demand via /api/knowledge endpoints
    print("[INFO] RAG knowledge base disabled for speed - using direct Qwen responses")

    yield

    # Shutdown: Close database
    await close_db()
    print("[OK] Database closed")


app = FastAPI(
    title="KrishiDrishti API",
    description="AI-Powered Smart Farming Assistant for Indian Farmers (PS-301)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    return JSONResponse({
        "name": "KrishiDrishti API",
        "version": "1.0.0",
        "description": "AI-Powered Smart Farming Assistant",
        "docs": "/docs",
        "status": "running"
    })


# Health check
@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy",
        "environment": settings.APP_ENV
    })


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["Sensors"])
app.include_router(advice.router, prefix="/api/advice", tags=["AI Advice"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(knowledge.router, tags=["Knowledge Base"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
