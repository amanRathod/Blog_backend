/* eslint-disable no-dupe-keys */
/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const User = require('../../../../model/user');
const Blog = require('../../../../model/blog');
const { uploadFile } = require('../../../../../s3');
const redis = require('../../../../../redis-client');
// const user = require('../../../../model/user');

exports.getUserData = async(req, res) => {
  try {
    const { username } = req.user;
    // redis
    let userData = await redis.get(`user:${username}`);
    let allBlog = await redis.get('allBlog');
    if (userData && allBlog) {
      allBlog = JSON.parse(allBlog);
      res.status(200).json({
        data: JSON.parse(userData),
        allBlog,
      });

      // after sending data to client, we can update the cache in redis server
      userData = await User.findOne({ username })
        .populate('blog')
        .populate('followers')
        .populate('following');

      allBlog = await Blog.find({})
        .populate('userId')
        .populate('comments')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId',
            select: 'fullName image username',
          },
        });
      // setex(key, seconds, value)
      redis.setex(`user:${username}`, 3600, JSON.stringify(userData));
      redis.setex('allBlog', 3600, JSON.stringify(allBlog));

      redis.setex(`user:${username}`, 3600, JSON.stringify(userData));
      return;
    }

    // get userData  including blogs
    userData = await User.findOne({ username })
      .populate('blog')
      .populate('followers')
      .populate('following');

    if (!allBlog) {
      allBlog = await Blog.find({})
        .populate('userId')
        .populate('comments')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId',
            select: 'fullName image username',
          },
        });
    }
    // setex(key, seconds, value)
    redis.setex(`user:${username}`, 3600, JSON.stringify(userData));
    redis.setex('allBlog', 3600, JSON.stringify(allBlog));

    res.status(200).json({
      data: userData,
      allBlog,
    });
  } catch (err) {
    console.log('errorr', err);
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
    await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );

    const data = await User.findById(id);
    redis.setex(`user:${data.username}`, 3600, JSON.stringify(data));

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

    await User.findByIdAndUpdate(profileId, {
      $addToSet: {
        followers: req.user._id,
      },
    });

    await User.findById(profileId, (err, result) => {
      if (err) {
        return res.status(500).json({
          type: 'error',
          message: 'Server is Invalid',
        });
      }
      if (result.following.indexOf(req.user._id) === -1) {
        result.following.push(req.user._id);
        result.save();
      }
    });

    const user = await User.findById(profileId).populate('followers');
    redis.setex(`user:${user.username}`, 3600, JSON.stringify(user));

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
    redis.setex(`user:${user.username}`, 3600, JSON.stringify(user));

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

    let userData = await redis.get(`user:${username}`);

    if (userData) {
      res.status(200).json({
        data: JSON.parse(userData),
      });

      userData = await User.findOne({ username })
        .populate('followers')
        .populate('following')
        .populate('blog')
        .populate({
          path: 'blog',
          populate: {
            path: 'userId',
          },
        });

      redis.setex(`user:${username}`, 3600, JSON.stringify(userData));
      return;
    }

    userData = await User.findOne({ username })
      .populate('followers')
      .populate('following')
      .populate('blog')
      .populate({
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
