const express = require('express')
const passport = require('passport')
const router = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const User = require('../models/Login_User')

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY
  })
);

// @Get auth/forgotPassword
router.get('/forgotPassword', (req, res) => {
  res.send('Send me yout email')
})

// @Post auth/forgotPassword
router.post('/forgotPassword', async (req, res) => {
  const {email} = req.body;
  try {

    const user = await User.findOne({email: email})
    if(!user){
      res.status(302).json({message: 'This e-mail is not registered'});
    }

      // create token and convert token-hexadecimal to string
  const token  = await crypto.randomBytes(32).toString('hex');
  // save token into user Database
  user.resetToken = token,
  user.expireToken = Date.now() + 30*60*1000 // 30 min
  user.save();

  const EmailToUser = {
    to: user.email,
    from: 'no-reply@blog.com',
    subject: 'Password Reset',
    text: `
      Bhosdk Neeche diye gaye link ko follow karo aur apna password reset karo, Bhuje.
      http://localhost:3000/resetPassword/${token}
    `,
  };
  // send e-mail to user
  await transport.sendMail(EmailToUser);

  res.status(200).json({message: `An e-mail has been sent to ${email} with further instructions.`})
  

  } catch (err) {
      console.error(err.message);
  }


})

// @Get auth/resetPassword
router.get('/resetPassword', (req, res) => {
  res.send('reset password')
})

// @Post auth/resetPassword
router.post('/resetPassword/:token', async (req, res) => {
  const {newPassword, confirmPassword, token} = req.body;
  
  if(newPassword !== confirmPassword){
    res.status(302).json({message: "Password doesn't Match"})
  }

  const user = await User.findOne({resetToken: token, expireToken: {$gt: Date.now()}});
  if(!user){
    res.status(302).json({message: "Try again session expired"});
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(newPassword, salt);

  await User.findOneAndUpdate({email: user.email}, {
    password: hashedPassword,
    expireToken: undefined,
    resetToken: undefined
  });

  const resetEmail = {
    to: user.email,
    from: 'no-reply@blog.com',
    subject: 'Your password has been changed',
    text: `
      This is a confirmation that the password for your account "${user.email}" has changed.
    `,
  };

  await transport.sendMail(resetEmail);
  res.status(200).json({message: 'Your password has been changed successfully'})

});

module.exports = router