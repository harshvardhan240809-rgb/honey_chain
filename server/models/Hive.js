const mongoose = require('mongoose')

const HiveSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  location: String,
  beekeeper: String,
  battery: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Hive', HiveSchema)
