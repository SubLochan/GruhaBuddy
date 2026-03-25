import requests
import base64
from app.config import Config

NVIDIA_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"

def generate_image(prompt, image_b64):
    headers = {
        "Authorization": f"Bearer {Config.NVIDIA_API_KEY}",
        "Accept": "application/json",
    }

    payload = {
        "prompt": prompt,
        "image": [f"data:image/png;base64,{image_b64}"],
        "width": 1024,
        "height": 1024,
        "steps": 4
    }

    res = requests.post(NVIDIA_URL, headers=headers, json=payload)
    res.raise_for_status()

    return res.json()