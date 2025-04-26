import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Category from '../models/category.js';
import { Op } from 'sequelize';

export default {
    async createCategory(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingCategory = await Category.findOne({ where: { name } });
            if (existingCategory) {
                throw new AppErrorAlreadyExists('Такая категория уже существует');
            }

            const category = await Category.create({ name });

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { newName } = req.body;

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ error: 'Категория не найдена' });
            }

            if (newName) {
                const existingCategory = await Category.findOne({
                    where: {
                        name: newName,
                        id: { [Op.ne]: category.id },
                    },
                });
                if (existingCategory) {
                    return res.status(400).json({ error: 'Категория с таким именем уже существует' });
                }
                category.name = newName;
            }

            await category.save();

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении категории' });
        }
    },

    async getCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id);

            if (!category) {
                return res.status(404).json({ error: 'Категория не найдена' });
            }

            res.json({
                id: category.id,
                name: category.name,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll({
                order: [['name', 'ASC']],
            });

            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id);

            if (!category) {
                return res.status(404).json({ error: 'Категория не найдена' });
            }

            await category.destroy({ force: true });

            res.json({ message: 'Категория успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
