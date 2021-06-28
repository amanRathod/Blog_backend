const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
})

module.exports = mongoose.model('Github_User', UserSchema);