import mongoose from 'mongoose';
const s = new mongoose.Schema({
  section: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { timestamps: true });
s.index({ section: 1, key: 1 }, { unique: true });
export default mongoose.models.SiteContent || mongoose.model('SiteContent', s);
