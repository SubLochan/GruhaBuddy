from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import base64
from dotenv import load_dotenv
import time

import ollama

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure NVIDIA FLUX API
NVIDIA_API_KEY = os.getenv('NVIDIA_API_KEY', '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')
NVIDIA_INVOKE_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"

def query_nvidia_flux(prompt, image_b64, width=1024, height=1024, seed=0, steps=4):
    """Call NVIDIA FLUX API to generate an image."""
    nvidia_headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
    }
    payload = {
        "prompt": prompt,
        "image": [f"data:image/png;base64,{image_b64}"],
        "width": width,
        "height": height,
        "seed": seed,
        "steps": steps
    }
    response = requests.post(NVIDIA_INVOKE_URL, headers=nvidia_headers, json=payload)
    response.raise_for_status()
    return response.json()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    history = data.get('history', []) # Optional: context
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        model_name = os.getenv('OLLAMA_MODEL', 'llama3')
        
        system_prompt = (
            "You are GruhaBuddy, an expert AI interior design assistant. "
            "Your sole purpose is to assist users with interior design, home decor, room layout, and using the GruhaBuddy application. "
            "Do NOT answer questions unrelated to interior design, home improvement, or this specific application. "
            "If a user asks a question outside this scope or if you do not know the answer, strictly reply with: "
            "'I can only assist with interior design queries. For other issues, please contact our support team at 123456789.' "
            "Keep your answers helpful, professional, and focused on design."
        )

        messages = [{'role': 'system', 'content': system_prompt}]
        messages.append({'role': 'user', 'content': user_message})

        response = ollama.chat(model=model_name, messages=messages)
        
        bot_reply = response['message']['content']
        return jsonify({'reply': bot_reply})
    except Exception as e:
        print(f"Ollama Error: {e}")
        return jsonify({'error': str(e), 'reply': "I'm having trouble connecting to my brain (Ollama). Please ensure it's running."}), 500


# Define Project Root
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # .../ai_service
PROJECT_ROOT = os.path.dirname(BASE_DIR)              # .../

@app.route('/generate', methods=['POST'])
def generate_design():
    data = request.json
    room_type = data.get('roomType', 'living room')
    style = data.get('style', 'modern')
    image_path = data.get('imagePath')

    print(f"Received request: {room_type}, {style}, {image_path}")

    # Validate inputs
    if not image_path:
        return jsonify({'status': 'error', 'message': 'Invalid inputs'}), 400

    # Resolve Image Path (Robustly)
    if not os.path.isabs(image_path):
        candidates = [
            os.path.join(PROJECT_ROOT, image_path),
            os.path.join(PROJECT_ROOT, 'server', image_path)
        ]
        for c in candidates:
            if os.path.exists(c):
                image_path = c
                break
    
    if not os.path.exists(image_path):
        return jsonify({'status': 'error', 'message': f'Image file not found: {image_path}'}), 400

    generated_image_path = None
    ai_message = "Design generated via NVIDIA FLUX API."

    try:
        # Read and encode the input image as base64
        with open(image_path, "rb") as img_file:
            image_b64 = base64.b64encode(img_file.read()).decode("utf-8")

        # Construct prompt
        prompt = (
            f"Professional interior design of a {style} {room_type}, "
            "photorealistic, 8k, high quality, architectural photography, "
            "detailed, cinematic lighting, based on the provided room image"
        )

        print(f"Calling NVIDIA FLUX API with prompt: {prompt}...")

        response_body = query_nvidia_flux(
            prompt=prompt,
            image_b64=image_b64,
            width=1024,
            height=1024,
            seed=0,
            steps=4
        )

        print(f"NVIDIA FLUX response received.")

        # Extract the generated image from the response
        # NVIDIA returns base64-encoded image(s) under 'artifacts' or 'images'
        generated_b64 = None
        if "artifacts" in response_body and response_body["artifacts"]:
            generated_b64 = response_body["artifacts"][0].get("base64")
        elif "images" in response_body and response_body["images"]:
            generated_b64 = response_body["images"][0]

        if not generated_b64:
            raise Exception(f"No image in NVIDIA FLUX response: {response_body}")

        # Decode and save the generated image
        image_data = base64.b64decode(generated_b64)
        timestamp = int(time.time() * 1000)
        filename = f"generated_{timestamp}.png"

        save_dir = os.path.join(PROJECT_ROOT, 'server', 'uploads')
        os.makedirs(save_dir, exist_ok=True)

        save_path = os.path.join(save_dir, filename)
        with open(save_path, "wb") as f:
            f.write(image_data)

        print(f"Generated image saved to {save_path}")
        generated_image_path = f"uploads/{filename}"

    except Exception as e:
        print(f"Error calling NVIDIA FLUX API: {e}")
        return jsonify({'status': 'error', 'message': f"NVIDIA FLUX Failed: {str(e)}"}), 500

    return jsonify({
        'status': 'success',
        'generated_image': generated_image_path,
        'message': ai_message
    })

if __name__ == '__main__':
    app.run(port=5001, debug=False)