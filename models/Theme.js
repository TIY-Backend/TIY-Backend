const mongoose = require('mongoose');
const ThemeSchema = new mongoose.Schema({
  themeid: {
    type: Number,
    required: true,
    unique: true,
  },
  theme: {
    type: String,
    required: true,
  },
});

module.exports = Theme = mongoose.model('theme', ThemeSchema);
