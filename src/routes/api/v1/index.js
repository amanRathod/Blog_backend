const express = require('express');
const router = express.Router();

router.use('/auth', require('./user/auth'));
router.use('/user', require('./user/user'));
router.use('/blog', require('./blog/blog'));

module.exports = router;

