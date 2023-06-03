const mongoose = require('mongoose');
const SkinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  white: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  blue: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  yellow: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  green: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  gray: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  pink: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  purple: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  orange: {
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
});

module.exports = Skin = mongoose.model('skin', SkinSchema);
