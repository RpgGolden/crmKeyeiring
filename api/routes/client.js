import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';
import clientController from '../controllers/client.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/getOne/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getUser)
    );

router
    .route('/getAll')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getAllUsers)
    );
router
    .route('/getAllEmployee')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getAllEmployee)
    );
    
router
    .route('/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.deleteUser)
    );

router
    .route('/getClientOrders/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getUserOrders)
    );

router.route('/createFeedback').post(upload.single('image'), asyncRoute(clientController.createFeedBack));

router
    .route('/getFeedBack/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getFeedBack)
    );
router
    .route('/getFeedBacksCRM')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK, roles.CLIENT])),
        asyncRoute(clientController.getFeedBackCRM)
    );

router.route('/getFeedBacksSite').get(asyncRoute(clientController.getFeedBackAll));
export default router;
