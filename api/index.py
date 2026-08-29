import os
import sys

# Ensure the root project directory is in the Python path for Vercel Serverless Function
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Expose the existing FastAPI ASGI application
from backend.main import app  # noqa: E402
