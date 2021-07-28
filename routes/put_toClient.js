const mongoose = require('mongoose')
const express = require('express')
const multer = require('multer');
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');
const path = require('path');

router.put('/changeFollower', async (req, res) => {
  const loggedId = req.query.loggedInUsername;
  const profileId = req.query.profileUsername;
  const toggleValue = req.query.toggleValue;

  const user1 = await User.findOne({_id: loggedId});
  const user2 = await User.findOne({_id: profileId})
  //if toggle is true then append the userId else delete
 
  try {
      if(toggleValue === 'true'){
          
          if(!user1.following.includes(profileId)){
              
              user1.following.push(profileId);
              user1.save()

          }
          if(!user2.followers.includes(loggedId)){
              
              user2.followers.push(loggedId);
              user2.save();
          }

      }else {
          for(let i = 0; i< user1.following.length; ++i) {
          
              if(String(user1.following[i]) === String(profileId)){
                  user1.following.splice(i, 1);
                  user1.save();
                  break;
              }
          }

          for(let i = 0; i< user2.followers.length; ++i) {
              if(String(user2.followers[i]) === String(loggedId)) {
                  user2.followers.splice(i, 1);
                  user2.save();
                  break;
              }
          }
      }
      res.status(200).json({loggedIn: user1, profile: user2});
      
  } catch (err) {
      console.error(err);
  }
})

const storage1 = multer.diskStorage({
    destination: "./public/coverPhoto/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const coverUpload = multer({storage: storage1, limits:{fileSize: 100000000}})

// router.use('/public', express.static('public'));

router.put('/updateBlog', coverUpload.single('file'), async (req, res) => {
    try {
        const {title, status, tags, blogId, content, file} = req.body
        const tag = JSON.parse(tags);
        let coverPhoto;
        if (req.file) {
            coverPhoto = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        }
        else {
            coverPhoto = file;// router.use('/public', express.static('public'));

        }
        const saveBlog = await Posts.findOneAndUpdate({_id: blogId}, { 
                title,
                status,
                tags: tag,
                content,
                photo: coverPhoto,
            });
        res.status(200).json({blog: saveBlog});
                   
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage, limits:{fileSize: 30000000}})


router.put('/updateProfile', upload.single('file'), async (req, res) => {
    
        const avatarUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        const { fullName, bio,  username} = req.body;
        try {
            const data = await User.findOneAndUpdate({username, username}, {
                fullName,
                bio,
                image: avatarUrl
            });
            res.status(200).json(data);
        
        } catch (err) {
            console.error(err)
            res.sendStatus(500);
        }
});


module.exports = router;