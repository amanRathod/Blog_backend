/* eslint-disable max-len */
// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const User = require('../model/user');
// const Posts = require('../model/Post');

// router.post('/addLikesId', async(req, res) => {
//   const loggedUsername = req.query.loggedUsername;
//   const blogId = req.query.blogId;
//   const toggle = req.query.toggle;
//   try {
//     const blog = await Posts.findOne({_id: blogId});
//     if (toggle === 'true'){
//       if (!blog.likes.includes(loggedUsername)) {
//         blog.likes.push(loggedUsername);
//         blog.save();
//       }
//     } else {
//       if (blog.likes.includes(loggedUsername)) {
//         blog.likes.splice(blog.likes.indexOf(loggedUsername), 1);
//         blog.save();
//       }
//     }
//     res.status(200).json(blog.likes);
//   } catch (err) {
//     console.error(err);
//   }
// });

// router.post('/addLikesIntoComments', async(req, res) => {
//   const loggedUsername = req.query.loggedUsername;
//   const blogId = req.query.blogId;
//   console.log(req.query);
//   const commentId = req.query.commentId;
//   const toggle = req.query.toggle;
//   try {
//     const posts = await Posts.findOne({_id: blogId});
//     for (let i = 0; i < posts.comments.length; ++i) {
//       if (String(posts.comments[i]._id) === String(commentId)){
//         if (toggle === 'true'){
//           if (!posts.comments[i].likes.includes(loggedUsername)){
//             posts.comments[i].likes.push(loggedUsername);
//             posts.save();
//             res.status(200).json(posts.comments);
//             break;
//           }
//         } else {
//           if (posts.comments[i].likes.includes(loggedUsername)){
//             posts.comments[i].likes.splice(posts.comments[i].likes.indexOf(loggedUsername), 1);
//             posts.save();
//             res.status(200).json(posts.comments);
//             break;
//           }
//         }
//       }
//     }

//     // res.status(302).send('user already liked')


//   } catch (err) {
//     console.error(err);
//   }
// });

// router.post('/postComment', async(req, res) => {
//   const blogId = req.query.blogId;
//   const comment = req.query.commentContent;
//   const username = req.query.loggedUsername;
//   // const loggedInUserId = req.query.loggedInUserId;

//   try {
//     const blog = await Posts.findOne({_id: blogId });
//     blog.comments.push({comment, username});
//     blog.save();
//     res.status(200).json({comments: blog.comments});

//   } catch (err) {
//     console.error(err);
//   }
// });

// const storage = multer.diskStorage({
//   destination: './public/coverPhoto',
//   filename: (req, file, cb) => {
//     cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
//   },

// });

// const upload = multer({ storage: storage, filesize: 100000000 });

// router.post('/addblog', upload.single('file'), async(req, res) => {
//   try {
//     const {title, content, userId, tags, status, file, username} = req.body;
//     let photoURL = '';
//     console.log('titleee', title);
//     const tag = JSON.parse(tags);
//     if (req.file) {
//       photoURL = req.protocol + '://' + req.get('host') + '/' + req.file.path;
//     } else {
//       photoURL = file;
//     }

//     const blog = await Posts.create({
//       title,
//       content,
//       userId,
//       tags: tag,
//       status,
//       photo: photoURL,
//       username,
//     });
//     blog.save();
//     res.status(200).json({success: 'Blog Published successfuly'});
//   } catch (err) {
//     console.error(err);
//     req.status(500).json({error: err});
//   }
// });

// module.exports = router;
