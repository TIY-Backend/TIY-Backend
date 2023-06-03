const mongoose = require('mongoose');
const SkinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  white: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  blue: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  yellow: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  green: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  gray: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  pink: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  purple: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
  orange: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    code: { type: String, required: true },
  },
});

module.exports = Skin = mongoose.model('skin', SkinSchema);
