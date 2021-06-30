const express = require('express')
const passport = require('passport')
const router = express.Router();

// @ GET auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } ));

// @ GET auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: "some error occured",
  }),
  (req, res) => {
    // res.send('LoggedIn successfully')
    res.redirect('/') 
  }
  
)

module.exports = router