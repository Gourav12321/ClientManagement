const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    
    clientName: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    receivedDate: {
      type: String,
      required: true,
    },
    inventoryRecieved: {
      type: String,
      required: true,
    },
    file: {
      type: [String],
      required: true,
    },
    reportedIssue: {
      type: String,
      required: true,
    },
    clientNotes: {
      type: String,
    },
    assignedTechnician: {
      type: String,
      required: true,
    },
    estimateAmount: {
      type: Number,
      required: true,
    },
    Deadline: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      required: true,
    },
  });

const Client = mongoose.model('Client' , ClientSchema);

module.exports = {Client};