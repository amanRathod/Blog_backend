/* eslint-disable no-dupe-keys */
/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const User = require('../../../../model/user');
const Blog = require('../../../../model/blog');
const { uploadFile } = require('../../../../../s3');

exports.getUserData = async(req, res) => {
  try {

    const { username } = req.user;

    // get userData  including blogs
    const userData = await User.findOne({username}).populate('blog').populate('followers').populate('following');
    const allBlog = await Blog.find({}).populate('userId').populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });

    res.status(200).json({
      data: userData,
      allBlog,
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

    const { id } = req.user;

    if (req.file) {
      const url = await uploadFile(req.file);
      req.body.image = url.Location;
    }
    await User.findOneAndUpdate({_id: id}, {
      ...req.body,
    });

    const data = await User.findById(id);
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

    const { profileId } = req.body;


    // add user to followers array
    await User.findByIdAndUpdate(profileId, {
      $push: {
        followers: req.user._id,
      },
    });

    // add user to following array
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        following: profileId,
      },
    });

    const user = await User.findById(profileId).populate('followers');

    res.status(200).json({
      type: 'success',
      message: 'followed successfully',
      followers: user.followers,
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

    const { profileId } = req.body;

    // remove user from followers array
    await User.findByIdAndUpdate(profileId, {
      $pull: {
        followers: req.user._id,
      },
    });

    // remove user from following array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        following: profileId,
      },
    });

    const user = await User.findById(profileId).populate('followers');

    res.status(200).json({
      type: 'success',
      message: 'unfollowed successfully',
      followers: user.followers,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.getUserProfile = async(req, res) => {
  try {
    const { username } = req.body;

    const userData = await User.findOne({username}).populate('followers').populate('following').populate('blog').populate({
      path: 'blog',
      populate: {
        path: 'userId',
      },
    });

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
