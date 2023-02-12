/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../../model/user');
const redis = require('../../../../../redis-client');

exports.register = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { username, email, password } = req.body;

    const usernameExists = await User.findOne({username: username});
    if (usernameExists){
      res.status(203).json({
        type: 'info',
        message: 'Username is already taken',
      });
    }


    const emailExists = await User.findOne({email: email});
    if (emailExists){
      res.status(203).json({
        type: 'error',
        message: 'User already exists, Please try with unregister Email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      ...req.body,
      password: hashedPassword,
      image: 'https://blog-dev-sample.s3.amazonaws.com/index.png',
    });

    res.status(200).json({
      type: 'success',
      message: 'User successfully created',
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};
exports.login = async(req, res, next) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }
    console.log(`pid no. ${process.pid}`);
    // destructure the request body
    const { email, password } = req.body;

    // verify user email
    // console time start for performance
    const startTime = process.hrtime();
    const user = await User.findOne({email: email});
    // console time end for performance
    const endTime = process.hrtime(startTime);
    console.log(`time taken ${endTime[0]} seconds and ${endTime[1] / 1000000} milliseconds`);

    if (!user) {
      return res.status(201).json({
        type: 'error',
        message: 'User email or passowrd is incorrect',
      });
    }

    // verify User password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(201).json({
        type: 'error',
        message: 'User email or passowrd is incorrect',
      });
    }

    // create jwt token
    const token = jwt.sign({id: user._id, email: user.email, username: user.username}, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });

    return res.status(200).json({
      type: 'success',
      message: 'Logged-In successfully',
      token,
      image: user.image,
      username: user.username,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.logout = async(req, res) => {
  try {
    const {token, tokenExp} = req;
    console.log('token', token);
    console.log('tokenExp', tokenExp);
    redis.setex(`blacklist_${token}`, tokenExp, true);

    res.status(200).json({
      type: 'success',
      message: 'Logged-Out successfully',
    });
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};
