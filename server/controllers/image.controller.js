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

        let commentsName = [];

        //let commentsName = comments;
        for (let i = 0; i < comments.length; i++) {
            let currentComment = {
                _id: comments[i]._id,
                img_id: comments[i].img_id,
                commenter_id: comments[i].commenter_id,
                commenter_string: '',
                post_date: comments[i].post_date,
                comment_text: comments[i].comment_text
            }
            let userName = await User.findById(comments[i].commenter_id);
            currentComment.commenter_string = userName.name;
            commentsName.push(currentComment);
        }
        res.json(commentsName);
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
            return res.status(200).json({
                message: "successfully deleted image as admin"
            });
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
            return res.status(200).json({
                message: "successfully deleted image"
            });
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

const userDeleteComment = async (req, res) => {
    console.log("userdeletecomment");
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
    const commentId = req.params.com_id;
    let commentData = await Comment.findById(commentId);
    if (decodedToken._id === commentData.commenter_id) {
        try {
            //delete the comment
            await Comment.deleteOne({ _id: commentId });
            return res.status(200),json({
                message: "successfully deleted comment"
            });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "deleting user is not the commenter"
        });
    }
}

const getSingleComment = async (req, res) => {
    try {
        let comment_id = req.params.com_id;
        let comment = await Comment.findById(comment_id);
        res.json(comment);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const editSingleComment = async (req, res) => {
    //verify that the editing user is the original commenter
    let comment_id = req.params.com_id;
    let thisComment = await Comment.findById(comment_id);
    const jwtToken = req.cookies.t;

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
    if (decodedToken._id === thisComment.commenter_id) {
        thisComment.comment_text = req.body.comment_text;
    } else {
        return res.status(400).json({
            error: "editing user is not the original poster"
        });
    }

    try {
        console.log(thisComment);
        await thisComment.save();
        return res.status(200).json({
            message: "Successfully edited comment!"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
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
    deleteComment,
    userDeleteComment,
    getSingleComment,
    editSingleComment
}