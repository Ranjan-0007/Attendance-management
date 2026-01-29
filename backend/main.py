from fastapi import FastAPI, UploadFile, File
import shutil
import os

app = FastAPI()

# Create uploads folder
if not os.path.exists("uploads"):
    os.mkdir("uploads")

@app.get("/")
def root():
    return {"message": "Backend running successfully"}

@app.get("/test")
def test():
    return {"status": "Frontend connected"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Image received and saved successfully"}
