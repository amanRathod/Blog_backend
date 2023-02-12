/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Joi = require('joi');
const User = require('../../../../controller/api/v1/user/auth');
const reset_password = require('../../../../controller/api/v1/user/reset_password');
const ratelimiter = require('../../../../../rate-limiter');
const validate = require('../../../../middleware/validate');
const authenticateUserToken = require('../../../../middleware/user');

const personLogin = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    error1: Joi.string().allow(null, ''),
  });

router.post('/login', validate(personLogin), User.login);

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

router.post('/logout', authenticateUserToken, User.logout);

module.exports = router;
