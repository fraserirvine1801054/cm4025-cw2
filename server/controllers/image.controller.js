import Image from '../models/image.model';
import Comment from '../models/image.comments.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import { useReducer } from 'react';

const listImages = async (req,res) => {
    try {
        let images = await Image.find().select('image_url image_title uploader uploaded');
        res.json(images);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const createImage = async (req,res) => {
    const image = Image(req.body);
    try {
        await image.save();
        return res.status(200).json({
            message: 'Successfully uploaded image!'
        });
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

//id is used to identify image
const listComments = async (req,res) => {
    try {
        let img_id = req.params.img_id;
        let comments = await Comment.find({img_id : img_id}).select('img_id commenter_id post_date comment_text')
        res.json(comments);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const createComment = async (req,res) => {
    const comment = new Comment(req.body);
    try {
        await comment.save();
        return res.status(200).json({
            message: 'Successfully uploaded comment!'
        });
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

export {
    createImage,
    listImages,
    createComment,
    listComments
}