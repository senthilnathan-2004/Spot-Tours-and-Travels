import mongoose from 'mongoose';
const s = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  destination: String,
  travelDate: String,
  message: String,
  status: {
    type: String,
    enum: ['new', 'read', 'resolved'],
    default: 'new'
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.Enquiry || mongoose.model('Enquiry', s);
