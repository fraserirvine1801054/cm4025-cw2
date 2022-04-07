import express from 'express';
import shopCtrl from '../controllers/shop.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

//admin add items
router.route('/api/shop/admin')
    .post(authCtrl.requireSignin,authCtrl.hasAdminAuthorization,shopCtrl.create);

//admin edit item
router.route('/api/shop/admin')
    .put(authCtrl.requireSignin,authCtrl.hasAdminAuthorization,shopCtrl.edit);

//list items
router.route('/api/shop/items')
    .get(shopCtrl.list);

export default router;