import mongoose from 'mongoose';

const ImgSingleCommentSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    post_date: {
        type: Date,
        default: Date.now
    },
    comment_text: {
        type: String,
        required: 'Comment requires something'
    },
    comment_likes: {
        type: Number
    },
    comment_dislikes: {
        type: Number
    }
});

const ImgCommentsSchema = new mongoose.Schema({

    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    comments: [ImgSingleCommentSchema]


});

const imgCommentsModel = mongoose.model('ImgComments', ImgCommentsSchema);
imgCommentsModel.createIndexes();