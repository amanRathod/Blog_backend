/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { body } = require('express-validator');
const Blog = require('../../../../controller/api/v1/blog/blog');
const authenticateUserToken = require('../../../../middleware/user');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({storage: storage});

router.post('/create', upload.single('file'), [
  body('title').not().isEmpty().withMessage('title is required'),
  body('content').not().isEmpty().withMessage('content is required'),
  body('tag').not().isEmpty().withMessage('tags is required'),
], authenticateUserToken, Blog.createBlog);

router.put('/update', upload.single('file'), authenticateUserToken, Blog.updateBlog);

router.put('/delete', authenticateUserToken, Blog.deleteBlog);

router.get('/all-blog', Blog.getAllBlog);

router.post('/toggle-like', [
  body('toggle').not().isEmpty().withMessage('toggle is required'),
  body('blogId').not().isEmpty().withMessage('blogId is required'),
], authenticateUserToken, Blog.toggleLike);

// router.get('/:Id', Blog.getBlogById);
router.use('/comment', require('./comment'));

module.exports = router;


// @Post('upload')
//   @ApiOperation({
//     summary: 'Upload a borrower image',
//   })
//   @CheckAbilities(AuthAction.UPDATE, AuthSubject.BORROWER)
//   @UseInterceptors(
//     FileFieldsInterceptor(
//       [
//         { name: 'image', maxCount: 1 },
//         { name: 'pledgeVideo', maxCount: 1 },
//       ],
//       saveFileToStorage,
//     ),
//   )
//   async uploadImage(
//     @UploadedFiles()
//     files: {
//       image?: Express.Multer.File;
//       pledgeVideo?: Express.Multer.File;
//     },
//   ) {
//     console.log('image', files);
//     return;
//   }