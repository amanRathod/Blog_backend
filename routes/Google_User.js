const express = require('express')
const passport = require('passport')
const router = express.Router();

// @ GET auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } ));

// @ GET auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'profile'] }) );

// Add Access Control Allow Origin headers
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// @ GET auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate('google', {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    console.log('success', req.user)
    res.status(200).json(req.user);
    // res.redirect('http://localhost:3000');
  }
  
)

//@ GET auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // res.send('LoggedIn successfully')
    res.status(200).json(req.user);
    res.redirect('http://localhost:3000');
  }
  
)

module.exports = router