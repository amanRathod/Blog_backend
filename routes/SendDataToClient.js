const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');
const { findOne } = require('../models/Post');

router.get('/userId/:id', async (req, res) => {
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

router.get('/allPosts', async (req, res, next) => {
    let data = [];

    try {
        Posts.find({}, function(err, posts) {
            let postsMap = {};
            Object.keys(posts).forEach(function(key) {
                let post = posts[key];
                postsMap[post._id] = post;
                
            })
            
            res.status(200).json(postsMap);

        });
    } catch(err) {
        console.error('errr', err.message);
    }
})

router.get('/singleUserData/:username', async (req, res) => {
    
    const username = req.params.username;
    try{
        const data = await User.findOne({username: username})
        res.status(200).send(data);
    } catch (err) {
        console.error(err.message);
    }
})

router.get('/UserByUsername/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const data = await User.findOne({username: username});
        Posts.find({}, function(err, posts) {
            let hashMap = {};
            Object.keys(posts).forEach(function(key) {
                let post = posts[key];
                if ( post.username === username ){
                    hashMap[post._id] = post;
                }
            })
            res.status(200).send({'UserData': data, 'UserBlogs': hashMap});
        });
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

router.get('/postById/:Id', async (req, res) => {
    const PostId = req.params.Id;
    try {
        const data = await Posts.findOne({_id: PostId});
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
    }
})  

module.exports = router;