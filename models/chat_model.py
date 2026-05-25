from pydantic import BaseModel

class ChatRequest(BaseModel):
    email: str
    message: str