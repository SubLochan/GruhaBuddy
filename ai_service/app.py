from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from PIL import Image
import io
import time

import ollama
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
GENAI_API_KEY = os.getenv('GEMINI_API_KEY')
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

# Configure Hugging Face
HF_API_TOKEN = os.getenv('HF_API_TOKEN')
HF_API_URL = "https://router.huggingface.co/models/stabilityai/stable-diffusion-2-1"  
headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

def query_huggingface(payload):
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    return response.content

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    history = data.get('history', []) # Optional: context
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Use a lightweight model by default, assume 'llama3' or 'mistral' is pulled
        # Check if we can specify model from env or default
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
        # Append history if needed, for now just current message
        messages.append({'role': 'user', 'content': user_message})

        response = ollama.chat(model=model_name, messages=messages)
        
        bot_reply = response['message']['content']
        return jsonify({'reply': bot_reply})
    except Exception as e:
        print(f"Ollama Error: {e}")
        return jsonify({'error': str(e), 'reply': "I'm having trouble connecting to my brain (Ollama). Please ensure it's running."}), 500


# Configure Local Stable Diffusion
import torch
from diffusers import StableDiffusionPipeline

# Global variable to hold the model (lazy loading)
pipe = None

def get_db_pipe():
    global pipe
    if pipe is None:
        print("Loading Stable Diffusion Model... (This may take time on first run)")
        try:
            model_id = "runwayml/stable-diffusion-v1-5"
            # Use fp16 for less VRAM usage (good for 4GB usage)
            pipe = StableDiffusionPipeline.from_pretrained(
                model_id, 
                torch_dtype=torch.float16, 
                use_safetensors=True,
                safety_checker=None # Optional: Disable safety checker to save VRAM
            )
            # Move to GPU
            if torch.cuda.is_available():
                pipe = pipe.to("cuda")
                # Optimizations for low VRAM (4GB)
                pipe.enable_attention_slicing()
                # pipe.enable_model_cpu_offload() # Alternative if 4GB is still tight
            else:
                print("CUDA not available. Running on CPU (Very Slow).")
                pipe = pipe.to("cpu")
                
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Failed to load model: {e}")
            return None
    return pipe

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
        # Try finding the file in likely locations
        candidates = [
            os.path.join(PROJECT_ROOT, image_path),          # If path is from root
            os.path.join(PROJECT_ROOT, 'server', image_path) # If path is relative to server
        ]
        for c in candidates:
            if os.path.exists(c):
                image_path = c
                break
    
    if not os.path.exists(image_path):
         return jsonify({'status': 'error', 'message': f'Image file not found: {image_path}'}), 400

    generated_image_path = None
    ai_message = "Design generated locally."

    try:
        # Load Model
        sd_pipe = get_db_pipe()
        
        if sd_pipe:
            # Construct Prompt
            prompt = f"Professional interior design of a {style} {room_type}, photorealistic, 8k, high quality, architectural photography, detailed, cinematic lighting and make sure the output is based on the provided image"
            negative_prompt = "low quality, bad quality, sketches, terrible, lowres, blurring"

            print(f"Generating image with prompt: {prompt}...")
            
            # Generate
            # Determine steps based on hardware (keep it lower for speed/memory if needed)
            image = sd_pipe(
                prompt=prompt, 
                negative_prompt=negative_prompt, 
                num_inference_steps=25, 
                guidance_scale=7.5
            ).images[0]

            # Save the generated image
            timestamp = int(time.time() * 1000)
            filename = f"generated_{timestamp}.png"
            
            # Ensure directory exists at PROJECT_ROOT/server/uploads
            save_dir = os.path.join(PROJECT_ROOT, 'server', 'uploads')
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)
                
            save_path = os.path.join(save_dir, filename)
            image.save(save_path)
            print(f"Image saved to {save_path}")
            
            generated_image_path = f"uploads/{filename}"
            ai_message = "Design generated successfully by Local Stable Diffusion."

        else:
             raise Exception("Model failed to load.")

    except Exception as e:
        print(f"Error calling Local SD: {e}")
        
        # FALLBACK: Try Gemini for Text Analysis if Local Gen fails
        if GENAI_API_KEY:
            print("Attempting fallback to Gemini (Text Analysis)...")
            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # Check if image exists for Gemini
                if os.path.exists(image_path):
                    img = Image.open(image_path)
                    gemini_prompt = f"Act as an interior designer. Analyze this room and provide detailed suggestions to redesign it in a {style} style for a {room_type}. Be specific about colors, furniture, and layout."
                    
                    response = model.generate_content([gemini_prompt, img])
                    gemini_text = response.text
                    
                    return jsonify({
                        'status': 'success',
                        'generated_image': image_path, # Return original image as visual
                        'message': f"Image generation failed ({str(e)}), but here is Gemini's Expert Advice:\n\n{gemini_text}",
                        'fallback': True
                    })
            except Exception as gemini_error:
                 print(f"Gemini Error: {gemini_error}")
                 return jsonify({'status': 'error', 'message': f"Gemini Error: {str(gemini_error)}"}), 500
        else:
             return jsonify({'status': 'error', 'message': f"Local Gen Failed: {str(e)}"}), 500

    return jsonify({
        'status': 'success',
        'generated_image': generated_image_path, 
        'message': ai_message
    })

if __name__ == '__main__':
    app.run(port=5001, debug=False)
