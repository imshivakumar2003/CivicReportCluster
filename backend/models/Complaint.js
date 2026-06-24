const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Roads', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Parks', 'Other'],
    default: 'Other'
  },
  location: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminNote: { type: String, default: '' },
  images: [{ type: String, default: null }],
  rating: { type: Number, min: 0, max: 5, default: null },
  feedback: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  daysToResolve: { type: Number, default: null },
  isRecurring: { type: Boolean, default: false },
  recurringGroup: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
