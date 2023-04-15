const mongoose = require('mongoose');
const POISchema = new mongoose.Schema({
  poiid: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  arid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'arelement',
  },
  grade: {
    type: Number,
    required: true,
  },
  gradesum: {
    type: Number,
    required: true,
  },
  gradecounter: {
    type: Number,
    required: true,
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'theme',
  },
});

module.exports = POI = mongoose.model('poi', POISchema);
