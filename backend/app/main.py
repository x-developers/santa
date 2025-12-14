from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .routes import router

# Create tables
os.makedirs("data", exist_ok=True)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secret Santa API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}
