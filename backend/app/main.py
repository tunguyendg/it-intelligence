
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.companies import router as companies_router
from app.api.reviews import router as reviews_router

app = FastAPI(
    title="IT Intelligence API",
    version="1.0.0"
)

# Cho phép React local gọi FastAPI

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://it-intelligence.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Đăng ký routers
app.include_router(companies_router)
app.include_router(reviews_router)


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "message": "IT Intelligence API is running"
    }
