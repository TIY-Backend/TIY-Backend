const mongoose = require('mongoose');
const TourSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  routeid: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  experience_level: {
    type: Number,
    required: true,
  },
  pois: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'poi',
    },
  ],
  duration: {
    type: String,
    required: true,
  },
  evaluation_grade: {
    type: Number,
    required: true,
  },
});

module.exports = Tour = mongoose.model('tour', TourSchema);
