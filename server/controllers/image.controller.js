import Image from '../models/image.model';
import Comment from '../models/image.comments.model';
import User from './../models/user.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import { useReducer } from 'react';

const listImages = async (req,res) => {
    try {
        let images = await Image.find().select('image_url image_title uploader uploaded');

        console.log(images);

        let imagesName = images;
        for (let i = 0; i < imagesName.length; i++) {
            let userName = await User.findById(images[i].uploader);
            imagesName[i].uploader = userName.name;
        }
        
        res.json(imagesName);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const createImage = async (req,res) => {
    console.log(req.body);
    const image = new Image(req.body);
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
        console.log(`listcomments: ${img_id}`);
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



export default {
    createImage,
    listImages,
    createComment,
    listComments
}