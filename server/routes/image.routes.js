import express from 'express';
import imgCtrl from '../controllers/image.controller';

const router = express.Router();

router.route('/api/pictures/images')
    .get(imgCtrl.listImages)
    .post(imgCtrl.createImage);

router.route('/api/pictures/images/:img_id')
    .delete(imgCtrl.userDeleteImage);

router.route('/api/pictures/comments')
    .post(imgCtrl.createComment);

router.route('/api/pictures/comments/:img_id')
    .get(imgCtrl.listComments);

//get single comment
router.route('/api/pictures/comments/:com_id')
    .get(imgCtrl.getSingleComment);

//edit single comment
router.route('/api/pictures/comments/edit/:com_id')
    .put(imgCtrl.editSingleComment);

router.route('/api/pictures/comments/:com_id')
    .delete(imgCtrl.userDeleteComment);

//admin operations
router.route('/api/pictures/images/admin/:img_id')
    .delete(imgCtrl.deleteImage);

router.route('/api/pictures/comments/admin/:comment_id')
    .delete(imgCtrl.deleteComment);

export default router;