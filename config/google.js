const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/Login_User')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('prfile -> ', profile)
        
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.email[0].value,
          image: profile.photos[0].value
        }

        // let user =  await User.findOne({googleId: profile.id});

        // try{
        //   if(user){
        //     return done(null, user)
        //   }
        //   else {
        //     user = User.create(newUser);
        //     done(null, user)
        //   }
        // }
        // catch(err) {
        //   console.error(err)
        // }
      }
    )
  )


  // Passport generates some identifying token, stuff it inside a cookie and send to the user's browser.
  passport.serializeUser((user, done) => {
    done(null, user.id) // user.id is ID assigned by MONGODB
  })

  // Passport figures out the user has already been authenticated and directs the server to send the requested posts to the user's browser.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(null, user))
  })
}




