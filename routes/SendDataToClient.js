const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/Login_User')

router.get('/userId/:id', async (req, res, next) => {
    const id  = req.params.id;
    console.log('iddd', id)
    try{

        const user = await User.findOne({_id: id});
        console.log('users backened', user)
        res.status(200).send(user);
    } catch(err) {
        console.error(err.message);
    }
})

module.exports = router;