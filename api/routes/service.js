import { Router } from 'express';
import serviceController from '../controllers/service.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/create')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        upload.single('image'),
        asyncRoute(serviceController.createService)
    );

router.route('/get/:name').get(asyncRoute(serviceController.getService));

router
    .route('/disable/:name')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(serviceController.disableService)
    );

router
    .route('/update/:name')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        upload.single('image'),
        asyncRoute(serviceController.updateService)
    );

router.route('/getAll').get(asyncRoute(serviceController.getAllServices));
router
    .route('/delete/:name')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(serviceController.deleteService)
    );

router
    .route('/changeRole/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR])),
        upload.single('image'),
        asyncRoute(serviceController.switchUserRole)
    );
router
    .route('/getAllRoles')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR])),
        upload.single('image'),
        asyncRoute(serviceController.getAllRoles)
    );
export default router;
