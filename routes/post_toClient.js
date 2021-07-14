const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');


router.post('/addLikesId', async (req, res) => {
  const UserId = req.query.userId;
  const blogId = req.query.blogId;
  try {
      const data = await Posts.findOne({_id: blogId});
      if(!data.likes.includes(UserId)) {
          data.likes.push(UserId);
          data.save();
      }
      res.status(200).json(data.likes);
  } catch (err) {
      console.error(err);
  }
})

router.post('/addLikesforComments', async (req, res) => {
  const userId = req.query.userId;
  const blogId = req.query.blogId;
  try {
      const posts = await Posts.findOne({_id: blogId});
      if(!posts.comments.likes.includes(userId)) {
          posts.comments.likes.push(userId)
          console.log('pos', posts);
          posts.save();
          console.log('postss',posts)
      }
      res.status(200).json(posts.comments.likes);
  } catch (err) {
      console.error(err)
  }
})

router.post('/postComment', async (req, res) => {
  const blogId = req.query.blogId;
  const comment = req.query.comment;
  
  const loggedInUserId = req.query.loggedInUserId;
  
  try {
      const posts = await Posts.findOne({_id: blogId });
      posts.comments.push({comment, loggedInUserId });
      posts.save();
      res.status(200).json({posts});

  } catch (err) {
      console.error(err);
  }
})

module.exports = router;
