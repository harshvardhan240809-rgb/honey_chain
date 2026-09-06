const mongoose = require('mongoose')

const SensorSampleSchema = new mongoose.Schema({
  hiveId: String,
  ts: Date,
  temperature: Number,
  humidity: Number,
  weight: Number,
  activity: Number,
  battery: Number
})

module.exports = mongoose.model('SensorSample', SensorSampleSchema)
