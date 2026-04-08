from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import base64
from io import BytesIO
from PIL import Image

# Import your algorithm here
# from crypto_engine import encrypt, decrypt 

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
async def encrypt_image(file: UploadFile = File(...), key: str = Form(...)):
    # Check key length (as per your ShiftBlock requirement)
    if len(key) != 8:
        raise HTTPException(status_code=400, detail="Key must be 8 characters.")

    # Read image file
    contents = await file.read()
    
    # Convert image to Base64 (This makes it a string your algorithm can process)
    img_str = base64.b64encode(contents).decode('utf-8')
    
    # --- CALL YOUR ALGORITHM HERE ---
    # ciphertext = encrypt(img_str, key)
    ciphertext = f"ENC_{img_str[:10]}..." # Placeholder logic
    
    return {
        "filename": file.filename,
        "encrypted_data": ciphertext
    }

# --- STEP 3: The Decryption Endpoint ---
@app.post("/decrypt")
async def decrypt_image(encrypted_data: str = Form(...), key: str = Form(...)):
    # --- CALL YOUR ALGORITHM HERE ---
    # decrypted_base64 = decrypt(encrypted_data, key)
    decrypted_base64 = encrypted_data.replace("ENC_", "") # Placeholder logic
    
    try:
        # Convert string back to binary image data
        image_bytes = base64.b64decode(decrypted_base64)
        return StreamingResponse(BytesIO(image_bytes), media_type="image/png")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid encrypted data or key.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)