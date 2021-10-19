/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const Blog = require('../../../../model/blog');
const User = require('../../../../model/user');
const { uploadFile } = require('../../../../../s3');

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
    const { file } = req.body;

    let photoURL = '';
    if (req.file) {
      const awsUrl = await uploadFile(req.file);
      photoURL = awsUrl.Location;
    } else {
      photoURL = file;
    }
    console.log(req.user);
    // save the blog
    const blog = await Blog.create({
      ...req.body,
      photo: photoURL,
      userId: req.user._id,
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

    const { file, blogId } = req.body;
    let coverPhoto;
    if (req.file) {
      const awsUrl = await uploadFile(req.file.path);
      coverPhoto = awsUrl.Location;
    } else {
      coverPhoto = file;

    }

    await Blog.findByIdAndUpdate({_id: blogId}, {
      ...req.body,
      photo: coverPhoto,
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
    const blogId = req.params.id;

    await Blog.findByIdAndDelete({_id: blogId});

    res.status(201).json({
      type: 'success',
      message: 'blog deleted successfully',
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
    const blog = await Blog.find({}).populate('userId');

    res.status(200).json({
      data: blog,
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
    console.log(user);
    console.log(req.body);

    // add userId into likes array of Blog collection if toggle is true and remove if toggle is false and vice versa
    let blog;
    if (toggle) {
      blog = await Blog.findByIdAndUpdate({_id: blogId}, {$addToSet: {likes: user._id}});
    } else {
      blog = await Blog.findByIdAndUpdate({_id: blogId}, {$pull: {likes: user._id}});
    }
    console.log(blog);

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
