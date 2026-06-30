const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  pricePerKm: { type: Number, required: true },
  description: String,
  numberPlate: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  available: { type: Boolean, default: true }
}, { timestamps: true })

const Car = mongoose.model('Car', carSchema);

module.exports = Car;