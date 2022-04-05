import express from 'express';
import imgCtrl from '../controllers/image.controller';


const router = express.Router();

router.route('/api/pictures/images')
    .get(imgCtrl.listImages)
    .post(imgCtrl.createImage);

router.route('/api/pictures/comments')
    .get(imgCtrl.listComments)
    .post(imgCtrl.createComment);