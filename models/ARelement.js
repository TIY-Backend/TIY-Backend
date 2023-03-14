const mongoose = require('mongoose');
const ARelementSchema = new mongoose.Schema({
  arid: {
    type: Number,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

module.exports = ARelement = mongoose.model('arelement', ARelementSchema);
