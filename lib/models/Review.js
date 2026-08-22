import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, default: 'Recently' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  trip: { type: String, default: 'Vacation Tour' },
  category: { type: String, default: 'Family' },
  text: { type: String, default: '' },
  approved: { type: Boolean, default: true },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
