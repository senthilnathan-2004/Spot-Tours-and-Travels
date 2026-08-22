import mongoose from 'mongoose';
const s = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  destination: String, region: String, theme: String,
  duration: String, durationDays: Number,
  price: Number, originalPrice: Number,
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  image: String,
  gallery: [String],
  overview: String,
  highlights: [String],
  itinerary: [{ day: String, title: String, details: String }],
  inclusions: [String],
  exclusions: [String]
}, { timestamps: true });
export default mongoose.models.Package || mongoose.model('Package', s);
