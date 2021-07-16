const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');
const Post = require('../models/Post');


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
  const commentId = req.query.commentId;
  try {
      const posts = await Posts.findOne({_id: blogId});
    console.log('poo', posts.comments)
      for(let i = 0; i< posts.comments.length; ++i) {
          if(String(posts.comments[i]._id) === String(commentId)){
              if(!posts.comments[i].likes.includes(userId)){
                  posts.comments[i].likes.push(userId);
                  posts.save();
                res.status(200).json(posts.comments);
              }
          }
      }
      res.status(302).send('user already liked')
      
      
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

router.post('/addblog', async (req, res) => {
  const {title, content, userId, tags, status, category} = req.body;
  try {
    const saveBlog = await Post.create({
      title,
      content,
      category,
      userId,
      tags,
      status,      
    });
    res.status(200).status(saveBlog);
  } catch (err) {
    console.error(err);
  }
})

module.exports = router;
