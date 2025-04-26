import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Dish from '../models/dish.js';
import path from 'path';
import { Op } from 'sequelize';
import Category from '../models/category.js';
import DishDto from '../dtos/dish-dto.js';

export default {
    async createDish(req, res) {
        try {
            const { name, description, price, categoryId } = req.body;
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;
            if (!name || !description || !price || !categoryId) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            // Check if the category exists
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Категория не найдена' });
            }

            const existingDish = await Dish.findOne({ where: { name } });
            if (existingDish) {
                throw new AppErrorAlreadyExists('Такое блюдо уже существует');
            }

            const dish = await Dish.create({ name, description, price, image, categoryId });

            const host = process.env.HOST; // Get the host from environment variables
            const dishDto = new DishDto(dish, host);

            res.json(dishDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateDish(req, res) {
        try {
            const { id } = req.params;
            const { newName, description, price, categoryId } = req.body;
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;

            const dish = await Dish.findByPk(id);

            if (!dish) {
                return res.status(404).json({ error: 'Блюдо не найдено' });
            }

            if (newName) {
                const existingDish = await Dish.findOne({
                    where: {
                        name: newName,
                        id: { [Op.ne]: dish.id },
                    },
                });
                if (existingDish) {
                    return res.status(400).json({ error: 'Блюдо с таким именем уже существует' });
                }
                dish.name = newName;
            }

            // Check if the category exists if categoryId is provided
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return res.status(404).json({ error: 'Категория не найдена' });
                }
                dish.categoryId = categoryId;
            }

            dish.description = description || dish.description;
            dish.price = price || dish.price;
            dish.image = image || dish.image;

            await dish.save();

            const host = process.env.HOST;
            const dishDto = new DishDto(dish, host);

            res.json(dishDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении блюда' });
        }
    },

    async getDish(req, res) {
        try {
            const dish = await Dish.findByPk(req.params.id, {
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!dish) {
                return res.status(404).json({ error: 'Блюдо не найдено' });
            }

            const host = process.env.HOST;
            const dishDto = new DishDto(dish, host);
            res.json(dishDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllDishes(req, res) {
        try {
            const dishes = await Dish.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name'],
                    },
                ],
                order: [['id', 'ASC']],
            });

            const host = process.env.HOST;
            const dishesWithDtos = dishes.map(dish => new DishDto(dish, host));
            res.json(dishesWithDtos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteDish(req, res) {
        try {
            const dish = await Dish.findByPk(req.params.id);

            if (!dish) {
                return res.status(404).json({ error: 'Блюдо не найдено' });
            }

            await dish.destroy({ force: true });

            res.json({ message: 'Блюдо успешно удалено' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
