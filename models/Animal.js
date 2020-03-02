const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients'
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  race: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  microChipId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('client', ClientSchema);
