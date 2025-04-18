import { Router } from 'express';
import orderController from '../controllers/order.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';
const router = Router();

router.route('/create').post(asyncRoute(orderController.createOrder));
router
    .route('/get')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(orderController.getMany)
    );
router
    .route('/changeStatus')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(orderController.changeStatus)
    );

router
    .route('/update/:id')
    .patch(authenticateToken, asyncRoute(checkRole([roles.ADMINISTRATOR])), asyncRoute(orderController.updateOrder));

router
    .route('/get/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(orderController.getOne)
    );



router
    .route('/getCanceled')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(orderController.getAllCanceled)
    );
export default router;
