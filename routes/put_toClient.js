const mongoose = require('mongoose')
const express = require('express')
const multer = require('multer');
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');
const app = express();

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


router.put('/updateBio', async (req, res) => {
  const bio = req.query.bio;
  const id = req.query.id;
  try {
      const data = await User.findOneAndUpdate({_id: id}, {bio: bio});
      res.status(200).json({bio: bio});
  } catch (err) {
      console.error(err)
  }
})

router.put('/saveBlog', async (req, res) => {
    const {title, category, status, tags, blogData, content} = req.body
    try {
        const post = await Posts.findOneAndUpdate({_id: blogData._id}, { 
            title,
            category,
            status,
            tags,   
            content,
        })
        res.status(200).json({post})
    } catch (err) {
        console.log(err);
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage}).single('file');
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'));


router.put('/updateProfile', async (req, res) => {

    upload(req,res, (err) => {
        console.log(req.file);
        console.log(req.body);
        // const path = req.file.path.split('/');
        // const avatarUrl = `http://localhost:3000/images/${path[1]}`;
        const { fullName, bio,  username} = req.body;
        if(!err) {
            return User.findOneAndUpdate({username, username}, {
                fullName,
                bio,
                // image: avatarUrl
                
            }, (err, user) => {
                if(!err){
                    return  res.status(200).send('updated successfully at => ')
                }
                return res.status(500).json(err)
            });
                   
        } 
        return res.status(500).json(err)
    })
});


module.exports = router;