import ShopItem from '../models/shop.items.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';
import { checkAdmin } from './user.controller';
import User from './../models/user.model';
import jwt, { decode } from 'jsonwebtoken';
import config from '../../config/config';

const create = async (req, res) => {
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
        return res.status('400').json({
            error: "posting user not found"
        });
    }
    if (user.admin) {
        const shopItem = new ShopItem(req.body);
        try {
            await shopItem.save();
            return res.status(200).json({
                message: "Successfully added shop item!"
            });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "posting user is not an admin"
        });
    }
}

const list = async (req, res) => {
    try {
        let items = await ShopItem.find().select('item_name item_price item_stock item_picture item_description');
        res.json(items);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const edit = async (req, res) => {
    console.log(req);
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

    let user = await User.findById(decodedToken._id);
    if (!user) {
        return res.status(400).json({
            error: "editing user not found"
        });
    }
    if (user.admin) {
        const newShopItem = new ShopItem(req.body);
        const itemId = req.params.itemId;

        let shopItem = await ShopItem.findById(itemId);
        shopItem.item_name = newShopItem.item_name;
        shopItem.item_price = newShopItem.item_price;
        shopItem.item_stock = newShopItem.item_stock;
        shopItem.item_description = newShopItem.item_description;
        shopItem.item_picture = newShopItem.item_picture;

        try {
            console.log(shopItem);
            await shopItem.save();
            return res.status(200).json({
                message: "Successfully edited shop item!"
            });
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else {
        return res.status(400).json({
            error: "editing user is not an admin"
        });
    }
}

const getSingleItem = async (req, res) => {
    try {
        let item = await ShopItem.findById(req.params.itemId);
        res.json(item);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const deleteItem = async (req, res) => {
    console.log("deleteitem");
    const jwtToken = req.cookies.t;
    console.log(jwtToken);

    let decodedToken;

    try {
         decodedToken = jwt.verify(jwtToken, config.jwtSecret);
    } catch (err){
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
        const itemId = req.params.itemId;

        try {
            await ShopItem.deleteOne({_id: itemId});
            return res.status(200).json({
                message: "successfully deleted shop item"
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

export default {
    create,
    list,
    edit,
    getSingleItem,
    deleteItem
}