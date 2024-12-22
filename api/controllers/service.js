import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Service from '../models/service.js';
import 'dotenv/config';
import path from 'path';
export default {
    async createService(req, res) {
        try {
            const { name, description, price } = req.body;
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;
            console.log(image);
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

    async getService(req, res) {
        try {
            const service = await Service.findOne({ where: { name: req.params.name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуги не найдено' });
            }

            // Формируем полный URL для изображения
            const image = service.image ? `${process.env.HOST}/${service.image}` : null;

            // Возвращаем данные услуги и URL изображения
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

    async disableService(req, res) {
        try {
            const service = await Service.findOne({ where: { name: req.params.name } });

            if (!service) {
                return res.status(404).json({ error: 'Услуги не найдено' });
            }

            service.isActive = false;
            await service.save();

            res.json({ message: 'Услуга успешно отключена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
