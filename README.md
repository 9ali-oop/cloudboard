# CloudBoard — Real‑time Collaborative Notes

CloudBoard is a minimal, real‑time collaborative notepad. Share a note ID with friends and type together instantly.

## ✨ Features
- Live multi‑user editing (Socket.IO)
- Presence & “is typing” indicators
- Autosave to MongoDB
- Minimal UI (React + Vite + Tailwind‑free vanilla CSS for speed)

## 🛠 Stack
- **Frontend:** React (Vite), socket.io‑client
- **Backend:** Node.js (Express + Socket.IO), MongoDB (Mongoose)
- **Dev:** Docker Compose (MongoDB), .env config

---

## ▶️ Quick start

### 0) Prereqs
- Node 18+ and npm
- Docker (for MongoDB)

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

## 🔐 Environment

`server/.env`:
```
MONGO_URI=mongodb://localhost:27017/cloudboard
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

---

## 📡 API & Socket events

**Socket rooms**
- `join_doc` → join a note by ID: `{ docId, user }`
- Server replies `doc_init` with `{ content }`
- Client emits `doc_update` on changes: `{ docId, content }`
- Broadcasts `presence` array and `typing` user

**REST**
- `GET /health` → `{ ok: true }`

---

## 📦 Commit plan (run these after generating the repo)

```bash
git init
git add .
git commit -m "chore: scaffold project structure (client, server, docker)"
git add .
git commit -m "feat(server): express + socket.io + mongoose + basic doc model"
git add .
git commit -m "feat(client): react vite app + socket wiring + editor + presence"
git add .
git commit -m "feat: autosave + typing indicators + debounce"
git add .
git commit -m "docs: README, env example, run instructions"
git add .
git commit -m "ops: docker compose, npm scripts"
```
Push normally after creating the repo on GitHub.
