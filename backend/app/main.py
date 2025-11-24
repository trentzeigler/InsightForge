from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.auth.router import router as auth_router
from app.datasets.router import router as datasets_router
from app.insights.router import router as insights_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InsightForge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(datasets_router, prefix="/datasets", tags=["datasets"])
app.include_router(insights_router, prefix="/insights", tags=["insights"])


@app.get("/health", tags=["health"])
async def healthcheck():
    return {"status": "ok"}
