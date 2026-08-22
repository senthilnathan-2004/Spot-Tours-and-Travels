import mongoose from 'mongoose';
const s = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: String,
  speciality: String,
  image: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.models.TeamMember || mongoose.model('TeamMember', s);
