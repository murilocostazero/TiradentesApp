const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['neutral', 'mild', 'moderate', 'serious', 'critical'],
    default: 'neutral',
  },
  type: {
    type: String,
    enum: ['behavior', 'health', 'other'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolution: {
    description: String,
    date: Date,
  },
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
