const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  distance: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  donation: { type: Number, default: 0 },
  refreshmentsPrice: { type: Number, default: 0 },
  refreshments: { type: [String], default: [] },
  paymentMethod: { type: String, default: 'Saved Visa (**** 9876)' },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] }
}, { timestamps: true });

const Mybookings = mongoose.model('Mybookings', rideSchema);

module.exports = Mybookings;