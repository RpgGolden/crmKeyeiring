import { Router } from 'express';
import orderController from '../controllers/order.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';
const router = Router();

router.route('/create').post(asyncRoute(orderController.createOrder));

router
    .route('/changeStatus')
    .post(authenticateToken, checkRole([roles.ADMINISTRATOR]), asyncRoute(orderController.changeStatus));

router
    .route('/update/:id')
    .patch(authenticateToken, checkRole([roles.ADMINISTRATOR]), asyncRoute(orderController.updateOrder));

router
    .route('/get/:id')
    .get(authenticateToken, checkRole([roles.ADMINISTRATOR, roles.COOK]), asyncRoute(orderController.getOne));

router
    .route('/get')
    .get(authenticateToken, checkRole([roles.ADMINISTRATOR, roles.COOK]), asyncRoute(orderController.getMany));

router
    .route('/getCanceled')
    .get(authenticateToken, checkRole([roles.ADMINISTRATOR]), asyncRoute(orderController.getAllCanceled));
export default router;
