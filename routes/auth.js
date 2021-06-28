const express = require('express')
const passport = require('passport')
const router = express.Router();

// @ GET auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } ));

// @ GET auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' } ),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router