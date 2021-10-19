const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Comment = require('../../../../controller/api/v1/blog/comment');

router.post('/', [
  body('content').not().isEmpty().withMessage('content is required'),
  body('blogId').not().isEmpty().withMessage('blogId is required'),
], Comment.addComment);

router.post('/addLike', Comment.addLikes);
router.put('/delete', Comment.deleteComment);

module.exports = router;
