const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User');
const Posts = require('../models/Post');


router.get('/userId/:id', async (req, res, next) => {
    const id  = req.params.id;
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
            const postsMap = {};

            posts.forEach(function(post) {
                postsMap[post._id] = post;
            })
            console.log(postsMap);
            res.send(postMap);

        })
    } catch(err) {
        console.error('errr', err.message);
    }
})

module.exports = router;