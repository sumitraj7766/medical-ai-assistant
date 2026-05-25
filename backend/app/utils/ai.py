from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

async def get_ai_response(message: str):

    completion = await client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are MediMind AI, a medical assistant."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return completion.choices[0].message.content