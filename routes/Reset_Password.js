const express = require('express')
const passport = require('passport')
const router = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const User = require('../models/Login_User')

// const transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "44240336e52ed7",
//     pass: "b8876322f864a8",
//   }
//   });

const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: process.env.SENDGRID_API_KEY,
}));

// @Get reset/forgotPassword
router.get('/forgotPassword', (req, res) => {
  res.send('Send me your email')
})

// @Post reset/forgotPassword
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
  user.save()

  console.log('reset token',user.resetToken)
  const EmailToUser = {
    to: user.email,
    from: 'bittu90670@gmail.com',
    subject: 'Password Reset',
    html: `
      <h5> You are receiving this because you (or someone else) have requested the reset of the password for your account..</h5>
      <p>Please click on this <a href='http://localhost:3000/resetPassword/${token}'>link</a> to reset Password</p>
      <h5>If you did not request this, please ignore this email and your password will remain unchanged.</h5>
    `,
  };
  // send e-mail to user
  // await transport.sendMail(EmailToUser);

  transport.sendMail(EmailToUser, (err, info) => {
    if(err){
        console.log('Error -> ',err);
    }
    else{
    console.log("Information ", info);
    res.status(200).json({message: `An e-mail has been sent to ${email} with further instructions.`})
    }
  });

  // res.status(200).json({message: `An e-mail has been sent to ${email} with further instructions.`})
  

  } catch (err) {
      console.error(err.message);
  }


})

// @Get reset/resetPassword
router.get('/resetPassword', (req, res) => {
  res.send('reset password')
})

// @Post reset/resetPassword
router.post('/resetPassword', async (req, res) => {
  const {newPassword, confirmPassword, token} = req.body;
  try{
  if(newPassword !== confirmPassword){
    res.status(302).json({message: "Password doesn't Match"})
  }

  const user = await User.findOne({resetToken: token, expireToken: {$gt: Date.now()}});
  if(!user){
    res.status(302).json({message: "Try again session expired"});
  }
  console.log('user', user.username);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

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
  }
  catch (err) {
    console.error(err);
  }
});

module.exports = router