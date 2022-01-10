/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Comment = require('../../../../controller/api/v1/blog/comment');
const authenticateUserToken = require('../../../../middleware/user');

router.post('/getComments', Comment.getAllComments);
router.post('/create', [
  body('content').not().isEmpty().withMessage('content is required'),
  body('blogId').not().isEmpty().withMessage('blogId is required'),
], authenticateUserToken, Comment.addComment);

router.post('/addLike', authenticateUserToken, Comment.addLikes);
router.put('/delete', Comment.deleteComment);

module.exports = router;
