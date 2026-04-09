# 🛡️ ShiftBlock-8 Cryptor (Image Encryption Web)
ShiftBlock-8 is a high-security image encryption platform designed to provide absolute privacy for digital assets. By transforming standard images into high-entropy "Snow Images," the platform ensures that sensitive visual data remains hidden in plain sight and is mathematically inaccessible without a unique user-defined key.

## ✨ What you can do
- **Encrypt**: upload an image → download a scrambled PNG (“snow image”)
- **Decrypt**: upload the scrambled PNG → view/download the original image
- **No server storage**: files are processed in-memory (no intentional saving to disk)


## 🧱 Tech stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)

## 🚀 Key Features

- **Visual Encryption:** Transforms recognizable images into unreadable digital noise (Snow Images).

- **Dual-Layer Security:** Combines cryptographic data scrambling with a visual noise output for stealthy storage.

- **Symmetric Key Logic:** Utilizes a robust 8-character master key system for encryption and decryption.

- **Tamper Detection:** Any modification to a single "snow pixel" renders the original data unrecoverable, ensuring 100% data integrity.

- **Zero-Trace Architecture:** Secure file handling via FastAPI ensures that original images are processed in-memory and never permanently stored on the server.

## 🧪 How to use (UI)
- **Encrypt**
  - Upload an image (PNG/JPG/WebP)
  - Enter an **8-character key**
  - Click **Encrypt** → your browser downloads the snow image PNG
- **Decrypt**
  - Upload the snow image PNG you downloaded
  - Enter the **same 8-character key**
  - Click **Decrypt** → preview + download decrypted image

