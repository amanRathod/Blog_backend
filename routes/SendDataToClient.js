const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');

router.get('/userId/:id', async (req, res, next) => {
    const id  = (req.params.id);
    let data = [];

    try{
        let store = '';
        for(let i = 0; i < id.length; ++i){
            if (id[i] === ',' || i === id.length-1){
                if(i === id.length-1) store += id[i];
                
                let localVar = await User.findOne({_id: store});
                data.push(localVar);
                store = '';
            }
            else {
                store += id[i];
            }
        }
        res.status(200).send(data);
    } catch(err) {
        console.error('errr',err.message);
    }
})

router.get('/allPosts', async (req, res) => {
    let data = [];

    try {
        Posts.find({}, function(err, posts) {
            let postsMap = {};

            posts.forEach(function(post) {
                postsMap[post._id] = post;
            })
            res.status(200).json(postsMap);

        })
        // res.status.json(postsMap);
    } catch(err) {
        console.error('errr', err.message);
    }
})

router.get('/singleId/:id', async (req, res) => {
    
    const id = req.params.id;
    try{
        const data = await User.find({_id: id})
        res.status(200).json(data[0]);
    } catch (err) {
        console.error(err.message);
    }
})

router.get('/postsById/:id', async (req, res) => {
    const id = req.params.id;
    try {
        
        Posts.find({}, function(err, posts) {
            let hashMap = {};
            posts.forEach(function(post) {
                if ( String(post.userId) === String(id) ){
                    hashMap[post._id] = post;
                }
            })
            res.status(200).send(hashMap);
        })
        
        
    } catch (err) {
        console.error(err);
    }
})

router.get('/UserByUsername/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const data = await User.findOne({username: username});
        res.send(data);
    } catch (err) {
        console.error(err);
    }
})

router.get('/UserFollow', (req, res) => {
    const loggedUsername = req.query.loggedInUsername;
    const profileId = (req.query.profileId);
    
    try{
        let boolValue = false;
        User.find({}, function(err, user) {
            user.forEach(function(user){
                if(user.username === loggedUsername){
                    if(user.following.includes(profileId)){
                    boolValue=true;
                    }
                }
            })
            res.send(boolValue);
        })

        
    } catch (err) {
        console.error(err);
    }
})

router.put('/changeFollower', async (req, res) => {
    const loggedId = req.query.loggedInUsername;
    const profileId = req.query.profileUsername;
    const toggleValue = req.query.toggleValue;
    console.log('logge', loggedId)
    console.log('profile', profileId)

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
                    console.log('user1', user1)
                    user1.save();
                    break;
                }
            }

            for(let i = 0; i< user2.followers.length; ++i) {
                if(String(user2.followers[i]) === String(loggedId)) {
                    user2.followers.splice(i, 1);
                    console.log('user2', user2);
                    user2.save();
                    break;
                }
            }
        }
        const userss = await User.findById({_id: profileId})
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
        console.log('bioo', data);
        res.status(200).json({bio: bio});
    } catch (err) {
        console.error(err)
    }
})

module.exports = router;