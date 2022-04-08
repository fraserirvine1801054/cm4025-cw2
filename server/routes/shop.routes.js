import express from 'express';
import shopCtrl from '../controllers/shop.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

//admin add items
router.route('/api/shop/admin')
    .post(shopCtrl.create);

//admin edit item
router.route('/api/shop/admin/:userId')
    .put(authCtrl.requireSignin,authCtrl.hasAdminAuthorization,shopCtrl.edit);

//list items
router.route('/api/shop/items')
    .get(shopCtrl.list);

//get single item
router.route('/api/shop/singleitem/:itemId')
    .get(shopCtrl.getSingleItem);

export default router;