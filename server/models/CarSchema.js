const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  drivername: String,
  carImage: String,
  carname: String,
  cartype: String,
  price: String,
  carno: {
    type: String
  },
}, { timestamps: true })

const Car = mongoose.model('Car', carSchema);

module.exports = Car;