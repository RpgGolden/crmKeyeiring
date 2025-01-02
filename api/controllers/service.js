import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Service from '../models/service.js';
import 'dotenv/config';
import path from 'path';
import { Op } from 'sequelize';

export default {
    async createService(req, res) {
        try {
            const { name, description, price } = req.body;
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;
            if (!name || !description || !price) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingService = await Service.findOne({ where: { name } });
            if (existingService) {
                throw new AppErrorAlreadyExists('Такая услуга уже существует');
            }

            const service = await Service.create({ name, description, price, image });

            res.json(service);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateService(req, res) {
        try {
            const { name } = req.params;
            const { newName, description, price } = req.body;
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;

            const service = await Service.findOne({ where: { name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуга не найдена' });
            }

            if (newName) {
                const existingService = await Service.findOne({
                    where: {
                        name: newName,
                        id: { [Op.ne]: service.id },
                    },
                });
                if (existingService) {
                    return res.status(400).json({ error: 'Услуга с таким именем уже существует' });
                }
                service.name = newName;
            }

            service.description = description || service.description;
            service.price = price || service.price;
            service.image = image || service.image;

            await service.save();

            res.json(service);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении услуги' });
        }
    },

    async getService(req, res) {
        try {
            const service = await Service.findOne({ where: { name: req.params.name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуга не найдена' });
            }

            const image = service.image ? `${process.env.HOST}/${service.image}` : null;

            res.json({
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                imageUrl: image,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllServices(req, res) {
        try {
            const services = await Service.findAll({
                where: {
                    isActive: true,
                }, order: [
                    ['createdAt', 'DESC'],
                    ['status', 'DESC'],
                ],
            });

            const servicesWithImageUrls = services.map(service => ({
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                imageUrl: service.image ? `${process.env.HOST}/${service.image}` : null,
                isActive: service.isActive,
            }));

            res.json(servicesWithImageUrls);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async disableService(req, res) {
        try {
            const service = await Service.findOne({ where: { name: req.params.name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуга не найдена' });
            }

            service.isActive = false;
            await service.save();

            res.json({ message: 'Услуга успешно отключена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteService(req, res) {
        try {
            const service = await Service.findOne({ where: { name: req.params.name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуга не найдена' });
            }

            await service.destroy({ force: true });

            res.json({ message: 'Услуга успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
