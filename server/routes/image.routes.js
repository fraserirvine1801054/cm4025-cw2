import express from 'express';
import imgCtrl from '../controllers/image.controller';

const router = express.Router();

router.route('/api/pictures/images')
    .get(imgCtrl.listImages)
    .post(imgCtrl.createImage);

router.route('/api/pictures/comments')
    .post(imgCtrl.createComment);

router.route('/api/pictures/comments/:img_id')
    .get(imgCtrl.listComments)
    
export default router;