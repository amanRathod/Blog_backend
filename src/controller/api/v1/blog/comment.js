/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const Blog = require('../../../../model/blog');
const Comment = require('../../../../model/comment');
const redis = require('../../../../../redis-client');

exports.addComment = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { blogId } = req.body;

    const comment = await Comment.create({
      ...req.body,
      userId: req.user._id,
    });

    // add comment to blog comments array
    await Blog.findOneAndUpdate({_id: blogId}, {$push: {comments: comment._id}});

    // get the all comments from blog and populate it with user data and likes data from comment collection
    const blog = await Blog.findOne({_id: blogId}).populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });

    redis.setex(`blog:${blogId}`, 3600, JSON.stringify(blog));

    res.status(200).json({
      type: 'success',
      message: 'Comment added successfully',
      data: blog.comments,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.addLikes = async(req, res) => {
  try {
    const { commentId, blogId } = req.body;
    const { id } = req.user;

    // check if commentID is already liked by user or not
    const comment = await Comment.findOne({_id: commentId});
    if (!comment.likes.includes(id)) {
      await Comment.findOneAndUpdate({_id: commentId}, {$push: {likes: id}});
    } else {
      await Comment.findOneAndUpdate({_id: commentId}, {$pull: {likes: id}});
    }

    const blog = await Blog.findOne({_id: blogId}).populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });
    redis.setex(`blog:${blogId}`, 3600, JSON.stringify(blog));

    res.status(200).json({
      comments: blog.comments,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.deleteComment = async(req, res) => {
  try {
    const { commentId, blogId } = req.body;

    await Comment.findByIdAndDelete({_id: commentId});

    await Blog.findOneAndUpdate({_id: blogId}, {$pull: {comments: commentId}});

    const blog = await Blog.findOne({_id: blogId}).populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });

    res.status(200).json({
      type: 'success',
      message: 'comment deleted successfully',
      data: blog.comments,
    });

  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.getAllComments = async(req, res) => {
  try {
    const { blogId } = req.body;
    let blog = await redis.get(`blog:${blogId}`);

    if (blog) {
      blog = JSON.parse(blog);
      res.status(200).json({
        comments: blog.comments,
        likes: blog.likes,
      });

      blog = await Blog.findOne({_id: blogId}).populate('comments').populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'fullName image username',
        },
      });

      redis.setex(`blog:${blogId}`, 3600, JSON.stringify(blog));
      return;
    }

    // all comments from blog
    blog = await Blog.findOne({_id: blogId}).populate('comments').populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'fullName image username',
      },
    });
    redis.setex(`blog:${blogId}`, 3600, JSON.stringify(blog));

    res.status(200).json({
      comments: blog.comments,
      likes: blog.likes,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};
