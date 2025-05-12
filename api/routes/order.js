import { Router } from 'express';
import orderController from '../controllers/order.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';
const router = Router();

router
    .route('/create')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.createOrder)
    );
router
    .route('/get')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.getMany)
    );

router
    .route('/getManyForProfile')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.getManyForProfile)
    );

router
    .route('/changeStatus')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.changeStatus)
    );

router
    .route('/update/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.updateOrder)
    );

router
    .route('/get/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.getOne)
    );

router
    .route('/getCanceled')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(orderController.getAllCanceled)
    );
export default router;
