const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/Login_User')

module.exports = function (passport) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      // User.findOne({ email: email }, (err, user) => {
      //   if (err) throw err;
      //   if (!user) return done(null, false, { message: 'That email is not registered' });
  
      //   bcrypt.compare(password, user.password, (err, result) => {
          
      //     if (result === true) {
      //       return done(null, user);
      //     } else {
      //       console.log(err)
      //       return done(null, false,{ message: 'Password is Invalid'});
      //     }
      //   });
      // });
      try {

        // verify Email
        let user = await User.findOne({email: email})
        if(!user){
          return done(null, false, { message: 'This email is not registered' });
        }

        //Verify Password
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass) return done(null, false, { message: 'Password is Incorrect'})

        return done(null, user);
      }
      catch(err) {
        console.error(err)
        // return done(null, false);
      }
    })
  );
    // store cookie inside browser got from localstorage
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // takes cookie and unrap it and takes cookie
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};