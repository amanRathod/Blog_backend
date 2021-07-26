const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const  multer =  require('multer')
const path = require('path');
const User = require('../models/Login_User');
const Posts = require('../models/Post');
const Post = require('../models/Post');
const { diskStorage } = require('multer');

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
  const liketoggle = req.query.liketoggle;
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

const storage = multer.diskStorage({
  destination: './public/coverPhoto',
  filename: (req, file, cb) => {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  }

})

const upload = multer({ storage: storage, filesize: 100000000 })

router.post('/addblog', upload.single('file'), async (req, res) => {
  try {  
    const {title, content, userId, tags, status} = req.body;
    const photoURL = req.protocol + '://' + req.get('host') + '/' + req.file.path;
    const blog = await Posts.create({
      title,
      content,
      userId,
     
      status,
      photo: photoURL,
    })
    blog.save();
    res.status(200).json({blog});
  } catch (err) {
    console.error(err)
    req.status(500).json({error: err})
  }
  console.log(req.file);
  
  try {
    const saveBlog = await Post.create({
      title,
      content,
      userId,
      tags,
      status,      
    });
    res.status(200).send(saveBlog);
  } catch (err) {
    console.error(err);
  }
})

module.exports = router;



// try {
//   const posts = await Posts.findOne({_id: blogId});
//   if(liketoggle === 'true') {

//     for(let i = 0; i< posts.comments.length; ++i) {
//         if(String(posts.comments[i]._id) === String(commentId)){
//             if(!posts.comments[i].likes.includes(userId)){
//                 posts.comments[i].likes.push(userId);
//                 posts.save();
//                 console.log('postsss', posts);
//                 console.log('yes-1')
//                 break;
//             }
//         }
//     }
    
//   }
//   else {
//     for(let i = 0; i< posts.comments.length; ++i) {
//       if(String(posts.comments[i]._id) === String(commentId)){
//           console.log('yesss')
//         for(let j = 0; j< posts.comments[i].likes.length; ++j) {
//           console.log('yessssssss')
//           if(posts.comments[i].likes[j] === userId){
//             posts.comments[i].likes.splice(j, 1);
          
//           posts.save();
//           console.log('postss', posts.comments[i].likes)
//           console.log('yes-2')
//           break;
//           }            
//         }
//       }
//     }
