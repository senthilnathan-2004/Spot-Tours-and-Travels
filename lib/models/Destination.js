import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  id: { type: String, default: () => 'dest_' + Date.now() },
  name: { type: String, required: true },
  state: { type: String, default: 'India' },
  tagline: { type: String, default: '' },
  banner: { type: String, default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
  bestTime: { type: String, default: 'Year-round' },
  idealDuration: { type: String, default: '3 - 4 Days' },
  category: { 
    type: String, 
    enum: ['Hill Station', 'Beach', 'Spiritual', 'International', 'Heritage', 'Wildlife'], 
    default: 'Hill Station' 
  },
  description: { type: String, default: '' },
  topAttractions: { type: [String], default: [] },
  travelTips: { type: String, default: '' },
  startingPrice: { type: String, default: '₹4,999' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
