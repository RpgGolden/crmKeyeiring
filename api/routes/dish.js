import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';
import dishController from '../controllers/dish.js'; // Assuming you have a dish controller
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/getOne/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(dishController.getDish)
    );

router
    .route('/getAll')
    .get(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(dishController.getAllDishes)
    );

router
    .route('/delete/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(dishController.deleteDish)
    );

router
    .route('/create')
    .post(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        upload.single('image'),
        asyncRoute(dishController.createDish)
    );

router
    .route('/update/:id')
    .patch(
        upload.single('image'),
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(dishController.updateDish)
    );

export default router;
