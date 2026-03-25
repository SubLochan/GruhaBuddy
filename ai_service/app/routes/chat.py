from flask import Blueprint, request, jsonify
from app.services.ollama_service import get_chat_response

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    if not message:
        return jsonify({"error": "Message required"}), 400

    try:
        reply = get_chat_response(message)
        return jsonify({"reply": reply})
    except Exception:
        return jsonify({"error": "Chat service failed"}), 500