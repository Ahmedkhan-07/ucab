const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: {
    type: String,
    default: 'user'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User;