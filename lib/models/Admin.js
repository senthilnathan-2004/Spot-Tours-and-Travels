import mongoose from 'mongoose';
const s = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, default: 'admin' }
}, { timestamps: true });
export default mongoose.models.Admin || mongoose.model('Admin', s);
