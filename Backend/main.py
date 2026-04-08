from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import base64
from io import BytesIO
from PIL import Image
from crypto_engine import encrypt, decrypt 

app = FastAPI(title="Cyber Image Encryptor API")

# --- STEP 1: Enable CORS ---
# This allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Cyber Engine Online"}

# --- STEP 2: The Encryption Endpoint ---
@app.post("/encrypt")
async def encrypt_image_endpoint(file: UploadFile = File(...), key: str = Form(...)):
    if len(key) != 8:
        raise HTTPException(status_code=400, detail="Key must be 8 characters.")

    contents = await file.read()
    # Convert image bytes to Base64 string
    img_str = base64.b64encode(contents).decode('utf-8')
    
    # Run ShiftBlock-8 logic
    try:
        encrypted_str = encrypt(img_str, key)
        return {"filename": file.filename, "encrypted_data": encrypted_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Encryption Error: {str(e)}")

@app.post("/decrypt")
async def decrypt_image_endpoint(encrypted_data: str = Form(...), key: str = Form(...)):
    try:
        # Run ShiftBlock-8 logic
        decrypted_img_str = decrypt(encrypted_data, key)
        
        # Convert Base64 string back to binary
        img_bytes = base64.b64decode(decrypted_img_str)
        
        return StreamingResponse(BytesIO(img_bytes), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Decryption failed. Check key or data.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)