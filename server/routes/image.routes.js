import express from 'express';
import imgCtrl from '../controllers/image.controller';

const router = express.Router();

router.route('/api/pictures/images')
    .get(imgCtrl.list)
    .post(imgCtrl.create);

router.route('/api/pictures/comments')
    .get(imgCtrl.list)
    .post(imgCtrl.create);