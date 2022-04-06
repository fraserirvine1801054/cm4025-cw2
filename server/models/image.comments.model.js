import mongoose from 'mongoose';

const ImgCommentsSchema = new mongoose.Schema({

    img_id: {
        type: String,
        required: 'Comment requires an image_id'
    },
    commenter_id: {
        type: String,
        required: 'Comment requires a user_id'
    },
    post_date: {
        type: Date,
        default: Date.now
    },
    comment_text: {
        type: String,
        required: 'Comment requires String'
    }
});

const imgCommentsModel = mongoose.model('ImgComments', ImgCommentsSchema);
imgCommentsModel.createIndexes();

export default imgCommentsModel;