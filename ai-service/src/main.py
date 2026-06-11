from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from pathlib import Path

import os

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from src.routes import symptom_routes, chat_routes, medicine_routes, ocr_routes

APP_NAME = os.getenv("APP_NAME", "MediAssist AI Service")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5000"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    print(f"✅ {APP_NAME} v{APP_VERSION} starting up...")
    print(f"🤖 Gemini Model: {os.getenv('GEMINI_MODEL', 'gemini-2.5-flash-lite')}")
    print(f"🌐 Allowed Origins: {ALLOWED_ORIGINS}")
    yield
    print(f"⛔ {APP_NAME} shutting down...")


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AI-powered medical assistant microservice using Google Gemini",
    debug=DEBUG,
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Include routers
app.include_router(symptom_routes.router)
app.include_router(chat_routes.router)
app.include_router(medicine_routes.router)
app.include_router(ocr_routes.router)

# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "message": f"{APP_NAME} is running",
        "version": APP_VERSION,
    }


# Root route
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "docs": "/docs",
        "health": "/health",
    }