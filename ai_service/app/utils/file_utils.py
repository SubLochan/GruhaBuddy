import os
import base64
import time

UPLOAD_DIR = "uploads"


def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def encode_image_to_base64(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def save_base64_image(image_b64):
    ensure_upload_dir()

    image_data = base64.b64decode(image_b64)

    filename = f"generated_{int(time.time() * 1000)}.png"
    save_path = os.path.join(UPLOAD_DIR, filename)

    with open(save_path, "wb") as f:
        f.write(image_data)

    return save_path


def is_valid_file_path(path):
    return os.path.exists(path) and os.path.isfile(path)