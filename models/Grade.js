const mongoose = require('mongoose');
const GradeSchema = new mongoose.Schema({
  poiid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'poi',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  grade: {
    type: Number,
    required: true,
  },
});

module.exports = Grade = mongoose.model('grade', GradeSchema);
