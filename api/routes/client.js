import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';
import clientController from '../controllers/client.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/getOne/:id')
    .get(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.getClient));

router
    .route('/getAll')
    .get(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.getAllClients));

router
    .route('/:id')
    .delete(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.deleteClient));

router
    .route('/getClientOrders/:id')
    .get(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.getClientOrders));

router.route('/createFeedback').post(upload.single('image'), asyncRoute(clientController.createFeedBack));

router
    .route('/getFeedBack/:id')
    .get(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.getFeedBack));
router
    .route('/getFeedBacksCRM')
    .get(authenticateToken, asyncRoute(checkRole([role.ADMINISTRATOR])), asyncRoute(clientController.getFeedBackCRM));

router.route('/getFeedBacksSite').get(asyncRoute(clientController.getFeedBackAll));
export default router;
