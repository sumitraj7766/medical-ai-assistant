from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from app.models.chat_model import ChatRequest
from fastapi import Form, UploadFile, File
from typing import Optional

from app.utils.ai import get_ai_response
from app.database import db

from app.routes.auth_routes import (
    router as auth_router
)

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# AUTH ROUTES
# =========================
app.include_router(auth_router)

# =========================
# CHAT MODEL
# =========================
class ChatRequest(BaseModel):
    message: str

# =========================
# ROOT API
# =========================
@app.get("/")
async def root():

    mongo_status = await db.command("ping")

    return {
        "message": "Medical AI Backend Running",
        "mongodb": mongo_status
    }

# =========================
# CHAT API
# =========================
@app.post("/chat")
async def chat(
    message: str = Form(...),
    email: str = Form("guest@gmail.com"),
    image: Optional[UploadFile] = File(None)
):

    previous_chats = await db.chat_history.find({
        "email": email
    }).sort("created_at", -1).limit(5).to_list(length=5)

    memory_text = ""

    for chat_item in previous_chats:
        memory_text += f"User: {chat_item['message']}\nAI: {chat_item['response']}\n"

    image_text = ""

    if image:
        image_bytes = await image.read()

        print("Image received:", image.filename)
        print("Image size:", len(image_bytes))

        image_text = f"""
User uploaded an image named {image.filename}.
Analyze it carefully as a medical assistant.
Give a safe medical observation report.
Do not give final diagnosis.
"""

    final_prompt = f"""
Previous medical history:
{memory_text}

Current user message:
{message}

Image information:
{image_text}
"""

    ai_response = await get_ai_response(final_prompt)

    await db.chat_history.insert_one({
        "email": email,
        "message": message,
        "image_name": image.filename if image else None,
        "response": ai_response,
        "created_at": datetime.utcnow()
    })

    return {
        "response": ai_response
    }