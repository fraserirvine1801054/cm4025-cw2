import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import { useResolvedPath } from 'react-router';

const router = express.Router();

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create);

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.read)
    .put(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.update)
    .delete(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.remove);

router.route('/api/users/admin/:userId')
    .get(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, userCtrl.listadmin);

router.param('userId', userCtrl.userByID);

router.route('/api/users/name/:userId')
    .get(userCtrl.getName);

export default router;