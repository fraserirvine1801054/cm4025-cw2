import Image from '../models/image.model';
import Comment from '../models/image.comments.model';
import User from './../models/user.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import { useReducer } from 'react';
import jwt from 'jsonwebtoken';
import config from '../../config/config';

const listImages = async (req, res) => {
    try {
        let images = await Image.find().select('image_url image_title uploader uploaded');

        console.log(images);

        //let imagesName = images;

        let imagesName = [];

        for (let i = 0; i < images.length; i++) {
            let currentImage = {
                _id: images[i]._id,
                image_url: images[i].image_url,
                image_title: images[i].image_title,
                uploader: images[i].uploader,
                uploader_string: '',
                uploaded: images[i].uploaded
            }
            let userName = await User.findById(images[i].uploader);
            currentImage.uploader_string = userName.name;
            console.log(currentImage);
            imagesName.push(currentImage);
        }

        res.json(imagesName);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const createImage = async (req, res) => {
    console.log(req.body);
    const image = new Image(req.body);
    try {
        await image.save();
        return res.status(200).json({
            message: 'Successfully uploaded image!'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

//id is used to identify image
const listComments = async (req, res) => {
    try {
        let img_id = req.params.img_id;
        console.log(`listcomments: ${img_id}`);
        let comments = await Comment.find({ img_id: img_id }).select('img_id commenter_id post_date comment_text')

        console.log(comments);

        let commentsName = comments;
        for (let i = 0; i < commentsName.length; i++) {
            let userName = await User.findById(comments[i].commenter_id);
            commentsName[i].commenter_id = userName.name;
        }

        res.json(comments);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const createComment = async (req, res) => {
    console.log("create comment call");
    const comment = new Comment(req.body);
    try {
        await comment.save();
        return res.status(200).json({
            message: 'Successfully uploaded comment!'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const deleteImage = async (req, res) => {
    console.log(req);
    const jwtToken = req.cookies.t;
    console.log(jwtToken);

    let decodedToken;

    try {
        decodedToken = jwt.verify(jwtToken, config.jwtSecret);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "cannot verify token"
        });
    }
    console.log(decodedToken);
    let user = await User.findById(decodedToken._id);
    if (!user) {
        return res.status(400).json({
            error: "deleting user not found"
        });
    }
    if (user.admin) {
        const imageId = req.params.img_id;
        try {
            //delete the image
            await Image.deleteOne({ _id: imageId });
            //delete all comments associated with image
            await Comment.deleteMany({ img_id: imageId });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "deleting user is not an admin"
        });
    }
}

const userDeleteImage = async (req, res) => {
    console.log(req);
    const jwtToken = req.cookies.t;
    console.log(jwtToken);

    let decodedToken;

    try {
        decodedToken = jwt.verify(jwtToken, config.jwtSecret);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "cannot verify token"
        });
    }
    console.log(decodedToken);
    let user = await User.findById(decodedToken._id);
    if (!user) {
        return res.status(400).json({
            error: "deleting user not found"
        });
    }
    const imageId = req.params.img_id;
    let imageData = await Image.findById(imageId);
    if (decodedToken._id === imageData.uploader) {
        try {
            //delete the image
            await Image.deleteOne({ _id: imageId });
            //delete all comments associated with image
            await Comment.deleteMany({ img_id: imageId });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "deleting user is not the uploader"
        });
    }
}

const deleteComment = async (req, res) => {
    console.log(req);
    const jwtToken = req.cookies.t;
    console.log(jwtToken);

    let decodedToken;

    try {
        decodedToken = jwt.verify(jwtToken, config.jwtSecret);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "cannot verify token"
        });
    }
    console.log(decodedToken);

    let user = await User.findById(decodedToken._id);
    if (!user) {
        return res.status(400).json({
            error: "deleting user not found"
        });
    }
    if (user.admin) {
        const commentId = req.params.comment_id;
        try {
            await Comment.deleteOne({ _id: commentId });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "deleting user is not an admin"
        });
    }
}



export default {
    createImage,
    listImages,
    createComment,
    listComments,
    deleteImage,
    userDeleteImage,
    deleteComment
}