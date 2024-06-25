// models/platformUser.js
const mongoose = require('mongoose');

const platformUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'platformusers' });

const PlatformUser = mongoose.model('PlatformUser', platformUserSchema);

module.exports = PlatformUser;
