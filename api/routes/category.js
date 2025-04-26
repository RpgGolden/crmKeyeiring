import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';
import categoryController from '../controllers/category.js'; // Assuming you have a category controller

const router = Router();

router
    .route('/getOne/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(categoryController.getCategory)
    );

router
    .route('/getAll')
    .get(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(categoryController.getAllCategories)
    );

router
    .route('/delete/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(categoryController.deleteCategory)
    );

router
    .route('/create')
    .post(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(categoryController.createCategory)
    );

router
    .route('/update/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([role.ADMINISTRATOR, role.COOK, role.CLIENT])),
        asyncRoute(categoryController.updateCategory)
    );

export default router;
