import os
from dotenv import load_dotenv

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
STATIC_IMAGE_DIR = "static/images"
STATIC_VIDEO_DIR = "static/videos"