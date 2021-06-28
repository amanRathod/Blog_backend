const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/Login_User');


//@path user/register
router.post('/register',  async (req, res) => {

  /** Different method for validation */
  // User.findOne({ email: req.body.email }, async (err, doc) => {
  //   if (err) throw err;
  //   if (doc) res.send("User Already Exists");
  //   if (!doc) {
  //     const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //     const newUser = new User({
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       email: req.body.email,
  //       password: hashedPassword,
  //     });
  //     await newUser.save();
  //     res.send("User Created");
  //   }
  // });

  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let error = {};

  /** will uncomment during production mode */
  // if(email !== /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/){
  //   error.email = 'Please enter a valid email address'
  // }
  // if(Object.keys(error).length > 0 ){
  //   return res.status(203).json( { error } );
  // }


  if(password.length < 6 ){
    error.password =  'Password must be atleast six character' ;
  }
  if(Object.keys(error).length > 0 ){
    return res.status(203).json( { error } );
  }

  if(password !== confirmPassword){
    error.confirmPassword =  "Password doesn't match" ;
  }
    
  if(Object.keys(error).length > 0 ){
    return res.status(203).json( { error } );
  }

  const emailExists = await User.findOne({email: email});
  if(emailExists){
    error.email = 'User already exists, Please try with unregister Email';
    res.status(203).json({
      error
    });
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try{
    const savedUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    res.status(200).send('User successfully created')

  }
  catch(err){
    console.error(err.message)
  }

});

// @path user/login
router.post('/login/', (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    
    if (err) throw err;

    console.log('errmessagee', info)
    if (!user) res.status(203).json(info);
    else if(info !== undefined) res.status(203).json(info)
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        // res.send("Successfully Authenticated");
        res.status(200).send(req.user);
      });
    }
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('logged Out successfully')
  
});


module.exports =  router
