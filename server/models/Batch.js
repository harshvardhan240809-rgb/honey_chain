const mongoose = require('mongoose')

const BatchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hiveId: String,
  beekeeper: String,
  harvestDate: String,
  quantityKg: Number,
  location: String,
  quality: String,
  processing: String,
  packaging: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Batch', BatchSchema)
