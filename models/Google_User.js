const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

})

module.exports = mongoose.model('Google_User', UserSchema);