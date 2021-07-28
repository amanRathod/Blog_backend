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
  },
  photo: {
    type: String,
  },
  tags: [{
    id: {
      type: String,
    },
    text: {
      type: String,
    }
  }],
  comments: [{
    comment: {
      type: String,
    },
    username: {
      type: String,
    },
    likes: [{
      type: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    required: true,
  },
  likes: [{
    type: String,
  }],
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