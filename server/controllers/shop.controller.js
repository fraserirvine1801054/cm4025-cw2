import ShopItem from '../models/shop.items.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req,res) => {

}

const list = async (req,res) => {
    try {
        let items = await ShopItem.find().select('item_name item_price item_stock item_picture item_description');
        res.json(items);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const edit = async (req,res) => {

}

export default {
    create,
    list,
    edit
}