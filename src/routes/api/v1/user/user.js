/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const User = require('../../../../controller/api/v1/user/user');
const authenticateUserToken = require('../../../../middleware/user');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({storage: storage});

router.post('/add-follower', authenticateUserToken, User.addFollower);
router.post('/remove-follower', authenticateUserToken, User.removeFollower);
router.get('/', authenticateUserToken, User.getUserData);
router.put('/update-profile', upload.single('file'), authenticateUserToken, User.updateProfile);

module.exports = router;
