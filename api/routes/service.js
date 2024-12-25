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
        checkRole([roles.ADMINISTRATOR]),
        upload.single('image'),
        asyncRoute(serviceController.createService)
    );

router.route('/get/:name').get(asyncRoute(serviceController.getService));

router
    .route('/disable/:name')
    .post(authenticateToken, checkRole([roles.ADMINISTRATOR]), asyncRoute(serviceController.disableService));

router
    .route('/update/:name')
    .patch(
        authenticateToken,
        checkRole([roles.ADMINISTRATOR]),
        upload.single('image'),
        asyncRoute(serviceController.updateService)
    );

router.route('/getAll').get(asyncRoute(serviceController.getAllServices));

export default router;
