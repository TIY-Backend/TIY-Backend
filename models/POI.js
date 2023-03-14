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
    lon: {
      type: Number,
    },
  },
  arid: {
    type: Number,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  gradecounter: {
    type: Number,
    required: true,
  },
});

module.exports = POI = mongoose.model('poi', POISchema);
