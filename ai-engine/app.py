
import os
import cv2
import numpy as np
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
# from diffusers import StableDiffusionPipeline
# import torch

app = Flask(__name__)
CORS(app)

# Ensure upload folder exists
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "GruhaBuddy AI Engine is running!"})

@app.route('/analyze-room', methods=['POST'])
def analyze_room():
    """
    Analyzes the room image to estimate dimensions and detect room type.
    """
    try:
        if 'image' not in request.files:
             # If image path is sent as text
            data = request.json
            image_path = data.get('imagePath')
            if not image_path or not os.path.exists(image_path):
                 return jsonify({"error": "Image not found"}), 400
            
            # Read image
            img = cv2.imread(image_path)
        else:
            file = request.files['image']
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            img = cv2.imread(file_path)

        # Basic Image Processing for Edge Detection (Room Layout)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)

        # Estimate simple features
        height, width = img.shape[:2]
        
        # Mock logic for room type detection based on color/features
        # In a real model, this would use a localized CNN
        return jsonify({
            "status": "success",
            "dimensions": {"width": width, "height": height},
            "detectedType": "Living Room (Confidence: 85%)",
            "features": ["Window detected", "Hardwood floor"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-design', methods=['POST'])
def generate_design():
    """
    Generates a new interior design using Stable Diffusion (Mocked for CPU/Speed).
    """
    try:
        data = request.json
        prompt = data.get('prompt', 'modern living room')
        style = data.get('style', 'Contemporary')
        
        # integration steps for Stable Diffusion:
        # pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", torch_dtype=torch.float16)
        # pipe = pipe.to("cuda")
        # image = pipe(prompt).images[0]
        # output_path = "generated_" + os.urandom(4).hex() + ".png"
        # image.save(output_path)

        # Returning a mock URL for frontend to display
        mock_images = [
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000", # Living Room
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000", # Bedroom
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000"  # Kitchen
        ]
        
        import random
        selected_image = random.choice(mock_images)

        return jsonify({
            "status": "success",
            "generatedImage": selected_image,
            "style": style,
            "prompt": prompt,
            "sustainabilityScore": random.randint(70, 95)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend_products():
    """
    Recommends products based on the generated design style.
    """
    data = request.json
    style = data.get('style', 'Modern')
    budget = data.get('budget', 10000)

    # Scikit-learn logic would go here to match user prefs vector with product vectors
    
    products = [
        {"name": f"{style} Sofa", "price": budget * 0.3, "category": "Furniture", "ecoFriendly": True},
        {"name": "Abstract Wall Art", "price": budget * 0.05, "category": "Decor", "ecoFriendly": False},
        {"name": "Bamboo Coffee Table", "price": budget * 0.15, "category": "Furniture", "ecoFriendly": True}
    ]

    return jsonify({
        "status": "success",
        "recommendations": products
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
