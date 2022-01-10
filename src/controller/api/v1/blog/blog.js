/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const Blog = require('../../../../model/blog');
const Comment = require('../../../../model/comment');
const User = require('../../../../model/user');
const { uploadFile } = require('../../../../../s3');
const redis = require('../../../../../redis-client');

exports.createBlog = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    // destructure data
    const { file, tag } = req.body;
    const tags = JSON.parse(tag);

    // upload file to aws
    let photoURL;
    if (req.file) {
      const awsUrl = await uploadFile(req.file);
      photoURL = awsUrl.Location;
    } else {
      photoURL = file;
    }

    // save the blog
    const blog = await Blog.create({
      ...req.body,
      photo: photoURL,
      userId: req.user._id,
      tags,
    });

    await User.findOneAndUpdate({username: req.user.username}, {$addToSet: {blog: blog._id}});

    res.status(200).json({
      type: 'success',
      message: 'Blog Published successfuly',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.updateBlog = async(req, res) => {
  try {
    const { file, blogId, tag } = req.body;
    const tags = JSON.parse(tag);

    let coverPhoto;
    if (req.file) {
      const awsUrl = await uploadFile(req.file);
      coverPhoto = awsUrl.Location;
    } else {
      coverPhoto = file;

    }

    await Blog.findByIdAndUpdate({_id: blogId}, {
      ...req.body,
      photo: coverPhoto,
      tags,
    });

    res.status(201).json({
      type: 'success',
      message: 'Blog updated successfully',
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.deleteBlog = async(req, res) => {
  try {
    const { blogId } = req.body;

    // deleted all comments of the blog
    await Blog.findByIdAndDelete({_id: blogId}).populate('comments').exec((err, blog) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          type: 'error',
          message: 'Server Invalid',
        });
      }
      // delete all comments of the blog
      blog.comments.forEach(async(comment) => {
        await Comment.findByIdAndDelete({_id: comment._id});
      });
    });

    // delete blog from user's blog array
    await User.findOneAndUpdate({username: req.user.username}, {$pull: {blog: blogId}});

    const allBlog = await Blog.find({}).populate('userId').populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });

    redis.setex('allBlog', 3600, JSON.stringify(allBlog));

    res.status(201).json({
      type: 'success',
      message: 'blog deleted successfully',
      allBlog,
    });
  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.getAllBlog = async(req, res) => {
  try {
    let allBlog = await redis.get('allBlog');
    if (allBlog) {
      allBlog = JSON.parse(allBlog);
      res.status(200).json({
        data: (allBlog),
      });

      redis.setex('allBlog', 3600, JSON.stringify(allBlog));
      return;
    }
    allBlog = await Blog.find({}).populate('userId');
    redis.setex('allBlog', 3600, JSON.stringify(allBlog));

    res.status(200).json({
      data: allBlog,
    });

  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.toggleLike = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { blogId, toggle } = req.body;
    const { username } = req.user;

    const user = await User.findOne({username});
    if (!user) {
      res.status(404).json({
        type: 'error',
        message: 'user not found',
      });
    }

    // add userId into likes array according to toggle
    if (toggle) {
      await Blog.findByIdAndUpdate({_id: blogId}, {$addToSet: {likes: user._id}});
    } else {
      await Blog.findByIdAndUpdate({_id: blogId}, {$pull: {likes: user._id}});
    }
    const blog = await Blog.findById({_id: blogId});

    res.status(201).json({
      data: blog.likes,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};
