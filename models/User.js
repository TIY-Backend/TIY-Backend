const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
  },
  age: {
    type: Number,
  },
  is_accessible: {
    type: String,
  },
  coins: {
    type: Number,
  },
  avatar: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
