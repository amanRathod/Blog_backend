/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const User = require('../../../../model/user');
const { uploadFile } = require('../../../../../s3');

exports.getUserData = async(req, res) => {
  try {

    console.log(req.user);
    const { username } = req.body;
    const userData = await User.findOne({username}).populate('blog').populate('followers').populate('following');

    res.status(200).json({
      data: userData,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.updateProfile = async(req, res) => {
  try {

    const { username } = req.user;

    if (req.file) {
      const url = await uploadFile(req.file);
      req.body.image = url.Location;
    }

    const data = await User.findOneAndUpdate({username}, {
      ...req.body,
    });

    res.status(200).json({
      type: 'success',
      message: 'profile updated successfully',
      data,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.addFollower = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { username } = req.body;

    // add user to followers array
    const profileUser = await User.findOneAndUpdate({username}, {
      $addToSet: {
        followers: req.user._id,
      },
    });

    // add user to following array
    const loggedInUser = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        following: profileUser._id,
      },
    });


    res.status(200).json({
      type: 'success',
      message: 'followed successfully',
      loggedInUser,
      profileUser,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.removeFollower = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { username } = req.body;

    // remove user from followers array
    const profileUser = await User.findOneAndUpdate({username}, {
      $pull: {
        followers: req.user._id,
      },
    });

    // remove user from following array
    const loggedInUser = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        following: profileUser._id,
      },
    });

    res.status(200).json({
      type: 'success',
      message: 'unfollowed successfully',
      loggedInUser,
      profileUser,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};
