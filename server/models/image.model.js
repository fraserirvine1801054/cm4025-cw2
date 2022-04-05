import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: 'Url is required'
    },
    image_title: {
        type: String
    },
    uploader: {
        type: String,
        required: 'Uploader ID is required'
    },
    uploaded: {
        type: Date,
        default: Date.now
    }
});

const imageModel = mongoose.model('Image', ImageSchema);
imageModel.createIndexes();

export default imageModel