import User from '../models/user.js';
import UserDto from '../dtos/user-dto.js';
import Order from '../models/order.js';
import FeedBackDto from '../dtos/feedback-dto.js';
import FeedBack from '../models/feedback.js';
import removeTimeZone from '../utils/removetimezone.js';
import path from 'path';
import FeedBackWZPhoneDto from '../dtos/feedback-withoutphone-dto.js';
import { AppErrorMissing } from '../utils/errors.js';
import UserFeedBackDto from '../dtos/client-dto-feedback.js';

export default {
    async getUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID пользователя не указан' });
            }
            const user = await User.findByPk(id, { include: [Order, FeedBack] });
            if (!user) {
                return res.status(400).json({ error: 'Такого пользователя не существует' });
            }
            const userDto = new UserFeedBackDto(user);
            // Удаляем временную зону из дат в заказах
            userDto.orders = userDto.orders.map(order => ({
                ...order,
                eventStartDate: removeTimeZone(order.eventStartDate),
                createdAt: removeTimeZone(order.createdAt),
            }));

            return res.json(userDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({ include: [Order] });
            const usersDto = users.map(user => {
                const userDto = new UserDto(user);

                userDto.orders = userDto.orders.map(order => ({
                    ...order,
                    eventStartDate: removeTimeZone(order.eventStartDate),
                    createdAt: removeTimeZone(order.createdAt),
                }));
                userDto.count = userDto.orders.length;

                if (userDto.orders.length > 0) {
                    userDto.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    userDto.lastOrderDate = userDto.orders[0].createdAt;
                } else {
                    userDto.lastOrderDate = undefined;
                }

                return userDto;
            });

            return res.json(usersDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID пользователя не указан' });
            }
            const user = await User.findByPk(id, { include: [Order] });
            if (!user) {
                return res.status(400).json({ error: 'Такого пользователя не существует' });
            }
            await user.destroy({ force: true });
            return res.json({ message: 'Пользователь успешно удален' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getUserOrders(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID пользователя не указан' });
            }
            const orders = await Order.findAll({ where: { clientId: id }, order: [['createdAt', 'DESC']] });
            const getCountOrders = orders.length;
            // Убираем таймзону из дат
            const ordersWithoutTimezone = orders.map(order => ({
                ...order.toJSON(), // Преобразуем экземпляр модели в обычный объект
                eventStartDate: removeTimeZone(order.eventStartDate),
                createdAt: removeTimeZone(order.createdAt),
            }));

            return res.json({
                orders: ordersWithoutTimezone,
                count: getCountOrders,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async createFeedBack(req, res) {
        try {
            const { phone, description, score } = req.body;

            if (!phone || !description || !score) {
                throw new AppErrorMissing('Не все данные заполнены');
            }
            const user = await User.findOne({ where: { phone } });
            if (!user) {
                throw new AppErrorMissing('Такого пользователя не существует');
            }
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;

            const feedback = await FeedBack.create({ clientId: user.id, image, description, score });
            await feedback.reload({ include: [User] });

            const feedBackDto = new FeedBackDto(feedback);

            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getFeedBack(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID отзыва не указан' });
            }
            const feedBack = await FeedBack.findByPk(id, { include: [User] });
            const feedBackDto = new FeedBackDto(feedBack);
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getFeedBackCRM(req, res) {
        try {
            const feedBack = await FeedBack.findAll({ include: [User] });
            const feedBackDto = feedBack.map(feedBack => new FeedBackDto(feedBack));
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getFeedBackAll(req, res) {
        try {
            const feedBack = await FeedBack.findAll({ include: [User] });
            const feedBackDto = feedBack.map(feedBack => new FeedBackWZPhoneDto(feedBack));
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
