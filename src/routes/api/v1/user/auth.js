/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const User = require('../../../../controller/api/v1/user/auth');
const reset_password = require('../../../../controller/api/v1/user/reset_password');
const ratelimiter = require('../../../../../rate-limiter');

router.post('/login', [
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
], ratelimiter({ secondsWindow: 10, allowedHits: 4 }), User.login);

router.post('/register', [
  body('fullName').not().isEmpty().withMessage('Full name is required'),
  body('username').not().isEmpty().withMessage('Username is required'),
], User.register);

router.post('/forgotPassword', [
  body('email').not().isEmpty().withMessage('Email is required'),
], reset_password.forgotPassword);

router.put('/resetPassword', [
  body('password').not().isEmpty().withMessage('Password is required'),
  body('token').not().isEmpty().withMessage('Token is required'),
], reset_password.resetPassword);

module.exports = router;
