const GithubStrategy = require('passport-github2').Strategy
const mongoose = require('mongoose')
// still need to make
const Users = require('../models/Users')


module.exports = function (passport) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
      
        const newUser = {
          githubId: profile.id,
          firstName: profile.displayName,
          image: profile.photos[0].value,
          email: profile.email,
        }

        console.log('profile->>', profile)
        
        try {
          let user = await Users.findOne({ githubId: profile.id }) 

          if (user) {
            done(null, user)
          } else {
            user = await Users.create(newUser)
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
    Users.findById(id, (err, user) => done(null, user)) //  retrieve the whole object from session
  })
 }