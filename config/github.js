const GithubStrategy = require('passport-github2').Strategy
const mongoose = require('mongoose')
// still need to make
const User = require('../models/Login_User');


module.exports = function (passport) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scope: ['user:email'],
        callbackURL: '/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
      
        const newUser = {
          firstName: profile.displayName,
          lastName: profile.lastName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        }
        console.log('emailssss ', profile.emails.value)
        console.log('emailssss ', profile.emails[0].value)
        console.log('profile->>', profile)
        
        try {
          let user = await User.findOne({ email: profile.emails[0].value}) 

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )


  // Passport generates some identifying token, save it inside a cookie and send to the user's browser.
  passport.serializeUser((user, done) => {
    done(null, user.id) // user.id is ID assigned by MONGODB and it is saved in session
  })

  // Passport figures out the user has already been authenticated and directs the server to send the requested posts to the user's browser.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(null, user)) //  retrieve the whole object from session
  })
 }