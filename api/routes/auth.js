import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
const router = Router();

router.route('/register').post(asyncRoute(authController.register));

router.route('/login').post(asyncRoute(authController.login));

router.route('/logout').post(asyncRoute(authController.logout));

router.route('/refresh').post(authenticateToken, asyncRoute(authController.refreshToken));

router
    .route('/getUsers')
    .get(authenticateToken, asyncRoute(checkRole([roles.ADMINISTRATOR])), asyncRoute(authController.getUsers));
export default router;
