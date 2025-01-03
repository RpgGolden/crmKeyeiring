import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';
import clientController from '../controllers/client.js';

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

export default router;
