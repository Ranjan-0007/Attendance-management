import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    image: str

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/upload")
def upload_image(data: ImageData):

    if not data.image:
        raise HTTPException(status_code=400, detail="Image is required")

    if "," not in data.image:
        raise HTTPException(status_code=400, detail="Invalid image format")

    header, image_base64 = data.image.split(",")

    if not any(fmt in header for fmt in ["image/jpeg", "image/png", "image/jpg"]):
        raise HTTPException(status_code=400, detail="Only JPG/PNG allowed")

    try:
        image_bytes = base64.b64decode(image_base64)
    except:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding")

    # 🔹 Convert bytes → OpenCV image
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Corrupted image")

    # 🔹 Brightness validation
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)

    if brightness < 40:
        raise HTTPException(
            status_code=400,
            detail="Image too dark. Please ensure proper lighting."
        )

    # 🔹 Save image
    os.makedirs("uploads", exist_ok=True)
    filename = f"img_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    filepath = os.path.join("uploads", filename)

    cv2.imwrite(filepath, img)

    return {
        "message": "Image validated & saved successfully",
        "brightness": round(float(brightness), 2)
    }