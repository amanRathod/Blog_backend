// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
// const User = require('../model/Login_User');
// const Posts = require('../model/Post');

// router.delete('/deleteBlog/:id', async(req, res) => {
//   try {
//     const BlogId = req.params.id;
//     const response = await Posts.findOneAndDelete({_id: BlogId});

//     Posts.find({}, function(err, posts) {
//       let postsMap = {};

//       posts.forEach(function(post) {
//         postsMap[post._id] = post;
//       });
//       Object.keys(postsMap).forEach(function(key) {
//         const val = postsMap[key];
//         postsMap[val._id] = val;
//       });
//       res.status(200).json(postsMap);

//     });

//   } catch (err) {
//     console.log(err);
//   }
// });

// router.delete('/deleteComment', async(req, res) => {
//   try {
//     const commentId = req.query.commentId;
//     const blogId = req.query.blogId;
//     const posts = await Posts.findOne({_id: blogId});

//     for (let i = 0; i < posts.comments.length; ++i) {
//       if (String(posts.comments[i]._id) === String(commentId)){
//         posts.comments.splice(i, 1);
//         break;
//       }
//     }
//     console.log(posts.comments);
//     res.status(200).send(posts.comments);

//   } catch (err) {
//     console.log(err);
//   }
// });

// module.exports = router;
