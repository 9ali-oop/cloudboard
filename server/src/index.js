import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import Document from './models/Document.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Mongo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cloudboard';
mongoose.connect(MONGO_URI).then(() => {
  console.log('Mongo connected');
}).catch(err => {
  console.error('Mongo error', err);
  process.exit(1);
});

// Socket.IO
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN }
});

const presenceByDoc = new Map(); // docId -> Set(usernames)
const typingByDoc = new Map();   // docId -> Set(usernames)

io.on('connection', (socket) => {
  let currentDoc = null;
  let currentUser = null;

  socket.on('join_doc', async ({ docId, user }) => {
    currentDoc = docId;
    currentUser = user || `user-${socket.id.slice(0,5)}`;
    socket.join(docId);

    // presence
    if (!presenceByDoc.has(docId)) presenceByDoc.set(docId, new Set());
    presenceByDoc.get(docId).add(currentUser);

    // load or create doc
    let doc = await Document.findById(docId).lean().exec();
    if (!doc) {
      await Document.create({ _id: docId, content: '' });
      doc = { _id: docId, content: '' };
    }

    socket.emit('doc_init', { content: doc.content });
    io.to(docId).emit('presence', Array.from(presenceByDoc.get(docId)) );
  });

  socket.on('doc_update', async ({ docId, content }) => {
    if (!docId) return;
    await Document.findByIdAndUpdate(docId, { content, updatedAt: new Date() }, { upsert: true });
    socket.broadcast.to(docId).emit('doc_patch', { content });
  });

  socket.on('typing', ({ docId, user }) => {
    if (!typingByDoc.has(docId)) typingByDoc.set(docId, new Set());
    const set = typingByDoc.get(docId);
    set.add(user);
    io.to(docId).emit('typing', Array.from(set));
    setTimeout(() => { // simple debounce-off
      set.delete(user);
      io.to(docId).emit('typing', Array.from(set));
    }, 1200);
  });

  socket.on('disconnect', () => {
    if (currentDoc && currentUser) {
      const set = presenceByDoc.get(currentDoc);
      if (set) {
        set.delete(currentUser);
        io.to(currentDoc).emit('presence', Array.from(set));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
