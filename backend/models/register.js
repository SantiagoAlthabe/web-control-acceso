const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  identity: String,
  event: String,
}, { collection: 'registers' });

module.exports = mongoose.model('Register', registerSchema);
