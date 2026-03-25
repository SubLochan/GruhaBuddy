import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

    if not NVIDIA_API_KEY:
        raise ValueError("Missing NVIDIA_API_KEY")