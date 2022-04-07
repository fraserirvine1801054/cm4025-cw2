import mongoose from 'mongoose';

const ShopItemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: 'shop item name is required'
    },
    item_price: {
        type: Number,
        required: 'shop item needs a price'
    },
    item_stock: {
        type: Number,
        required: 'item needs a stock amount'
    },
    item_picture: {
        type: String
    },
    item_description: {
        type: String
    }

});

const shopItemModel = mongoose.model('ShopItems', ShopItemSchema);
shopItemModel.createIndexes();

export default shopItemModel;