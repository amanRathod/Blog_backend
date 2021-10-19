/* eslint-disable max-len */
const { validationResult } = require('express-validator');
const Blog = require('../../../../model/blog');
const Comment = require('../../../../model/comment');

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

    await Blog.findOneAndUpdate({_id: blogId}, {$addToSet: {comments: comment._id}});

    res.status(200).json({
      type: 'success',
      message: 'Comment added successfully',
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
    const { toggle, commentId } = req.body;

    let comment;
    if (toggle) {
      comment = await Comment.findByIdAndUpdate({_id: commentId}, {$addToSet: {likes: req.user._id}});
    } else {
      comment = await Comment.findByIdAndUpdate({_id: commentId}, {$pull: {likes: req.user._id}});
    }

    res.status(200).json({
      data: comment,
    });

  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};

exports.deleteComment = async(req, res) => {
  try {
    const { commentId, blogId } = req.params;

    await Comment.findByIdAndDelete({_id: commentId});

    const comment = await Blog.findOne({_id: blogId}).populate('comments');

    res.status(200).json({
      type: 'success',
      message: 'comment deleted successfully',
      data: comment,
    });

  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: 'Server Invalid',
    });
  }
};
