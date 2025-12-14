from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .database import engine, Base
from .routes import router

# Create tables
Base.metadata.create_all(bind=engine)
logger.info("Database tables created")

app = FastAPI(title="Secret Santa API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api")
def api_root():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/api/health")
def api_health():
    return {"status": "ok"}


# API routes
app.include_router(router, prefix="/api")
