const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  issue: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String }, // New field for storing the image path
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
