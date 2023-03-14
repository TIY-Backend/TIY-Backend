const mongoose = require('mongoose');
const RouteSchema = new mongoose.Schema({
  routeid: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  pois: {
    type: [Number],
    required: true,
  },
  evaluation_grade: {
    type: Number,
    required: true,
  },
  experience_level: {
    type: Number,
    required: true,
  },
  themeid: {
    type: Number,
    required: true,
  },
});

module.exports = Route = mongoose.model('route', RouteSchema);
