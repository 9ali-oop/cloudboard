import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  _id: { type: String },       // docId (human or uuid)
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', DocumentSchema);
