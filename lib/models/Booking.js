import mongoose from 'mongoose';
const s = new mongoose.Schema({
  bookingRef: { type: String, required: true, unique: true },
  packageId: String,
  packageTitle: String,
  destination: String,
  duration: String,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  travelDate: String,
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  vehicleType: String,
  hotelCategory: String,
  specialNotes: String,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.Booking || mongoose.model('Booking', s);
