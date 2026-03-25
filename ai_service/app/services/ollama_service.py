import ollama
from app.config import Config

def get_chat_response(message):
    system_prompt = (
        "You are GruhaBuddy, an expert AI interior design assistant..."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]

    response = ollama.chat(
        model=Config.OLLAMA_MODEL,
        messages=messages
    )

    return response["message"]["content"]