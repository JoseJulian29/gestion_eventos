const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  eventName: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
