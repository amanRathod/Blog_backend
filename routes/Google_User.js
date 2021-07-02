const express = require('express')
const passport = require('passport')
const router = express.Router();

// @ GET auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } ));

// @ GET auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'profile'] }) );


// @ GET auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: 'http://localhost3000',
    failureRedirect: "http://localhost:3000/login",
    failureMessage: "some error occured",
  }),
  (req, res) => {
    // res.send('LoggedIn successfully')
    res.json(req.user)
  }
  
)

//@ GET auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login",
    failureMessage: "some error occured",
  }),
  (req, res) => {
    // res.send('LoggedIn successfully')
    res.json(req.user);
  }
  
)

module.exports = router