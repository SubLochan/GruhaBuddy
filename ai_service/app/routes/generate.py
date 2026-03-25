from flask import Blueprint, request, jsonify
import base64, os, time
from app.services.flux_service import generate_image

generate_bp = Blueprint("generate", __name__)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@generate_bp.route("/", methods=["POST"])
def generate():
    data = request.json

    image_path = data.get("imagePath")
    room_type = data.get("roomType", "living room")
    style = data.get("style", "modern")

    if not image_path or not os.path.exists(image_path):
        return jsonify({"error": "Invalid image path"}), 400

    try:
        with open(image_path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode()

        prompt = f"{style} {room_type}, interior design, photorealistic"

        result = generate_image(prompt, image_b64)

        # 🔥 handle both response formats
        generated_b64 = None

        if "artifacts" in result and result["artifacts"]:
            generated_b64 = result["artifacts"][0].get("base64")
        elif "images" in result and result["images"]:
            generated_b64 = result["images"][0]

        if not generated_b64:
            raise Exception(f"No image returned from API: {result}")

        img_data = base64.b64decode(generated_b64)

        filename = f"{int(time.time())}.png"
        path = os.path.join("uploads", filename)

        with open(path, "wb") as f:
            f.write(img_data)

        return jsonify({
            "status": "success",
            "generated_image": path,
            "message": "Generated successfully"
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500