# CloudBoard — Real‑time Collaborative Notes

CloudBoard is a minimal, real‑time collaborative notepad. Share a note ID with friends and type together instantly.

## Features
- Live multi‑user editing (Socket.IO)
- Presence & “is typing” indicators
- Autosave to MongoDB
- Minimal UI (React + Vite + Tailwind‑free vanilla CSS for speed)

## Stack
- **Frontend:** React (Vite), socket.io‑client
- **Backend:** Node.js (Express + Socket.IO), MongoDB (Mongoose)
- **Dev:** Docker Compose (MongoDB), .env config

---

## Quick start:

### 1) Start MongoDB
```bash
docker compose up -d
```

### 2) Start the server
```bash
cd server
cp .env.example .env   # edit if needed
npm install
npm run dev
```
Server runs on `http://localhost:4000`.

### 3) Start the client
```bash
cd ../client
npm install
npm run dev
```
Client runs on `http://localhost:5173` (Vite default).

---
