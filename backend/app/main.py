from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, tree, chat

settings = get_settings()

app = FastAPI(
    title="Agentic Tree API",
    description="AI-powered binary tree visualization backend",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tree.router, prefix="/tree", tags=["tree"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])


@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Agentic Tree API"}
