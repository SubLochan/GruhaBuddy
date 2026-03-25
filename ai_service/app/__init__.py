from flask import Flask
from .extensions import cors
from .routes.chat import chat_bp
from .routes.generate import generate_bp

def create_app():
    app = Flask(__name__)

    cors.init_app(app)

    app.register_blueprint(chat_bp, url_prefix="/chat")
    app.register_blueprint(generate_bp, url_prefix="/generate")

    return app