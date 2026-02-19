from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_design():
    data = request.json
    room_type = data.get('roomType', 'living room')
    style = data.get('style', 'modern')
    image_path = data.get('imagePath')

    print(f"Received request: {room_type}, {style}, {image_path}")

    # Simulate AI processing time
    time.sleep(2)

    # In a real scenario, we would process image_path with Stable Diffusion here.
    # For now, we return a mock success response.
    # We can return the same image or a placeholder "designed" image.
    
    # Mock result
    result_image = image_path # Just echo for now, or use a specific asset if available
    
    return jsonify({
        'status': 'success',
        'generated_image': result_image,
        'message': f'Generated {style} {room_type} design'
    })

if __name__ == '__main__':
    app.run(port=5001, debug=False)
