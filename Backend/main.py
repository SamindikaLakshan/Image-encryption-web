from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import base64
from io import BytesIO
from crypto_engine import encrypt, decrypt, text_to_snow_image, snow_image_to_text, CHAR_TO_INDEX
from PIL import Image, UnidentifiedImageError

app = FastAPI(title="Cyber Image Encryptor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"] # Important for downloads
)

MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB
ALLOWED_ENCRYPT_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
ALLOWED_DECRYPT_CONTENT_TYPES = {"image/png"}


def _validate_key(key: str) -> str:
    if key is None:
        raise HTTPException(status_code=400, detail="Key is required.")
    if len(key) != 8:
        raise HTTPException(status_code=400, detail="Key must be 8 characters.")
    bad = [c for c in key if c not in CHAR_TO_INDEX]
    if bad:
        raise HTTPException(
            status_code=400,
            detail="Key contains unsupported characters. Use standard ASCII letters/numbers/symbols.",
        )
    return key


async def _read_limited(upload: UploadFile, *, limit: int) -> bytes:
    data = await upload.read(limit + 1)
    if len(data) > limit:
        raise HTTPException(status_code=413, detail=f"File too large (max {limit} bytes).")
    return data


def _validate_upload(
    upload: UploadFile,
    *,
    allowed_content_types: set[str],
    field_name: str = "file",
) -> None:
    if upload is None:
        raise HTTPException(status_code=400, detail=f"{field_name} is required.")
    if not upload.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")
    ctype = (upload.content_type or "").lower()
    if ctype not in allowed_content_types:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{upload.content_type}'.",
        )


def _verify_image_bytes(contents: bytes) -> None:
    try:
        with Image.open(BytesIO(contents)) as img:
            img.verify()
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid/corrupted image file.")


@app.post("/encrypt")
async def encrypt_image_endpoint(file: UploadFile = File(...), key: str = Form(...)):
    _validate_upload(file, allowed_content_types=ALLOWED_ENCRYPT_CONTENT_TYPES)
    key = _validate_key(key)

    try:
        contents = await _read_limited(file, limit=MAX_UPLOAD_BYTES)
        _verify_image_bytes(contents)
        # 1. Image -> Base64
        img_str = base64.b64encode(contents).decode('utf-8')
        
        # 2. Encrypt Text
        encrypted_str = encrypt(img_str, key)
        
        # 3. Convert Text -> Snow Image (BytesIO)
        snow_image_io = text_to_snow_image(encrypted_str)
        
        # 4. Return as a FILE, not a dictionary
        return StreamingResponse(
            snow_image_io, 
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=scrambled_noise.png"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Encryption failed.")

@app.post("/decrypt")
async def decrypt_image_endpoint(file: UploadFile = File(...), key: str = Form(...)):
    _validate_upload(file, allowed_content_types=ALLOWED_DECRYPT_CONTENT_TYPES)
    key = _validate_key(key)
         
    try:
        # 1. Read the uploaded Snow Image
        snow_contents = await _read_limited(file, limit=MAX_UPLOAD_BYTES)
        _verify_image_bytes(snow_contents)
        
        # 2. Snow Image -> Encrypted Text
        encrypted_str = snow_image_to_text(snow_contents)
        if not encrypted_str:
            raise HTTPException(status_code=400, detail="Invalid encrypted image (no readable payload).")
        
        # 3. Decrypt Text -> Base64
        decrypted_base64 = decrypt(encrypted_str, key)
        
        # 4. Base64 -> Binary Image
        try:
            img_bytes = base64.b64decode(decrypted_base64, validate=True)
        except Exception:
            raise HTTPException(status_code=400, detail="Decryption failed (invalid payload).")
        
        return StreamingResponse(BytesIO(img_bytes), media_type="image/png")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail="Decryption failed. Check key or file.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)