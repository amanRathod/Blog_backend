const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');

router.delete('/deleteBlog/:id', async (req, res) => {
  try {
    const BlogId = req.params.id;
    const response = await Posts.findOneAndDelete({_id: BlogId});
    
    Posts.find({}, function(err, posts) {
      let postsMap = {};

      posts.forEach(function(post) {
          postsMap[post._id] = post;
      })
      Object.keys(postsMap).forEach(function(key) {
        const val = postsMap[key];
        postsMap[val._id] = val;
      });
      res.status(200).json(postsMap);

    })
    
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;