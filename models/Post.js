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
  comments: [{
    comment: {
      type: String,
    },
    fullName: {
      type: String,
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [{
    type: Number,
  }],
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }

})

module.exports = mongoose.model('Post', PostSchema);