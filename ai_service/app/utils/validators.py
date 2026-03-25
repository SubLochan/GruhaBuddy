ALLOWED_ROOM_TYPES = [
    "living room",
    "bedroom",
    "kitchen",
    "bathroom",
    "office"
]

ALLOWED_STYLES = [
    "modern",
    "minimal",
    "classic",
    "industrial",
    "scandinavian"
]


def validate_generate_input(data):
    if not data:
        return False, "No data provided"

    image_path = data.get("imagePath")
    if not image_path:
        return False, "imagePath is required"

    room_type = data.get("roomType", "living room").lower()
    if room_type not in ALLOWED_ROOM_TYPES:
        return False, f"Invalid roomType. Allowed: {ALLOWED_ROOM_TYPES}"

    style = data.get("style", "modern").lower()
    if style not in ALLOWED_STYLES:
        return False, f"Invalid style. Allowed: {ALLOWED_STYLES}"

    return True, {
        "image_path": image_path,
        "room_type": room_type,
        "style": style
    }


def validate_chat_input(data):
    if not data:
        return False, "No data provided"

    message = data.get("message")
    if not message or not message.strip():
        return False, "Message is required"

    if len(message) > 2000:
        return False, "Message too long"

    return True, message.strip()