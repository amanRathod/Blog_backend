const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');


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

module.exports = router;