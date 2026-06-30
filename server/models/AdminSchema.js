const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
}, { timestamps: true })

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin;