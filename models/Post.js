const mongoose = require('mongoose');
const User = require('./Login_User');
const Comment = require('./comment');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  photo: {
    type: String,
  },
  comment: {
    text: String,
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

})

module.exports = mongoose.model('Post', PostSchema);