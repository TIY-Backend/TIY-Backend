const mongoose = require('mongoose');
const SkinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  white: {
    type: String,
    required: true,
  },
  blue: {
    type: String,
    required: true,
  },
  yellow: {
    type: String,
    required: true,
  },
  green: {
    type: String,
    required: true,
  },
  gray: {
    type: String,
    required: true,
  },
  pink: {
    type: String,
    required: true,
  },
  purple: {
    type: String,
    required: true,
  },
  orange: {
    type: String,
    required: true,
  },
});

module.exports = Skin = mongoose.model('skin', SkinSchema);
