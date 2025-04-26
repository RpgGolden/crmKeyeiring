import { AppErrorMissing } from '../utils/errors.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import OrderDto from '../dtos/order-dto.js';
import sendOrderConfirmationEmail from '../utils/mailer.js';
import removeTimeZone from '../utils/removetimezone.js';
import Dish from '../models/dish.js';
import OrderDish from '../models/orderDish.js';

export default {
    async createOrder(req, res) {
        try {
            const {
                numberOfPeople,
                eventType,
                preferences,
                eventStartDate,
                budget,
                deliveryMethod,
                deliveryAddress,
                dishes,
            } = req.body;

            if (!numberOfPeople || !eventType || !eventStartDate || !budget || !deliveryMethod || !deliveryAddress) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const userId = req.user.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            const order = await Order.create({
                clientId: user.id,
                clientName: user.name,
                clientEmail: user.email,
                clientPhone: user.phone,
                numberOfPeople,
                eventType,
                preferences: preferences || '',
                eventStartDate,
                budget,
                deliveryMethod,
                deliveryAddress,
            });

            // Add dishes to the order
            if (dishes && Array.isArray(dishes)) {
                for (const { dishId, quantity } of dishes) {
                    const dish = await Dish.findByPk(dishId);
                    if (!dish) {
                        return res.status(404).json({ error: `Блюдо с ID ${dishId} не найдено` });
                    }

                    await OrderDish.create({
                        orderId: order.id,
                        dishId: dish.id,
                        quantity: quantity || 1,
                    });
                }
            }

            await order.reload({ include: [User, Dish] });
            const orderDto = new OrderDto(order);

            await sendOrderConfirmationEmail(
                user.email,
                user.name,
                user.phone,
                numberOfPeople,
                eventType,
                eventStartDate
            );

            return res.json(orderDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getMany(req, res) {
        try {
            const orders = await Order.findAll({
                include: [User],
                order: [
                    ['status', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
            });
            const ordersDto = orders.map(order => new OrderDto(order));

            // Удаляем временную зону из eventStartDate
            const ordersWithoutTimeZone = ordersDto.map(order => {
                return {
                    ...order,
                    eventStartDate: removeTimeZone(order.eventStartDate),
                    createdAt: removeTimeZone(order.createdAt),
                };
            });
            return res.json(ordersWithoutTimeZone);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    async changeStatus(req, res) {
        try {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ error: 'Не все данные заполнены' });
            }

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }

            const validStatuses = ['pending', 'approved', 'declined', 'completed', 'canceled'];
            const nonReversibleStatuses = ['declined', 'completed', 'canceled'];

            if (!validStatuses.includes(status)) {
                return res.status(409).json({ error: 'Некорректный статус' });
            }

            if (nonReversibleStatuses.includes(order.status)) {
                return res.status(409).json({ error: 'Статус не может быть изменен' });
            }

            const allowedTransitions = {
                pending: ['approved', 'declined', 'canceled'],
                approved: ['completed', 'canceled'],
                declined: [],
                completed: [],
                canceled: [],
            };

            if (!allowedTransitions[order.status].includes(status)) {
                return res.status(409).json({ error: 'Недопустимый переход статуса' });
            }

            order.status = status;
            await order.save();

            const orderDto = new OrderDto(order);
            return res.json(orderDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateOrder(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID заказа не указан' });
            }
            const order = await Order.findByPk(id, { include: [User] });

            if (!order) {
                return res.status(400).json({ error: 'Такого заказа не существует' });
            }

            if (order.status === 'canceled' || order.status === 'completed' || order.status === 'declined') {
                return res.status(400).json({ error: 'Заказ уже завершен' });
            }

            const { numberOfPeople, eventType, preferences, eventStartDate, budget, deliveryMethod, deliveryAddress } =
                req.body;

            // Используем данные пользователя из req.user, но не изменяем их
            const userId = req.user.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            order.numberOfPeople = numberOfPeople || order.numberOfPeople;
            order.eventType = eventType || order.eventType;
            order.preferences = preferences || order.preferences;
            order.eventStartDate = eventStartDate || order.eventStartDate;
            order.budget = budget || order.budget;
            order.deliveryMethod = deliveryMethod || order.deliveryMethod;
            order.deliveryAddress = deliveryAddress || order.deliveryAddress;

            await order.save();

            await order.reload({ include: [User] });
            const orderDto = new OrderDto(order);
            return res.json(orderDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getOne(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID заказа не указан' });
            }
            const order = await Order.findByPk(id, { include: [User] });
            if (!order) {
                return res.status(400).json({ error: 'Такого заказа не существует' });
            }
            const orderDto = new OrderDto(order);
            return res.json(orderDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllCanceled(req, res) {
        try {
            const orders = await Order.findAll({
                where: {
                    status: 'canceled',
                },
                include: [User],
            });
            const ordersDto = orders.map(order => new OrderDto(order));

            // Удаляем временную зону из eventStartDate
            const ordersWithoutTimeZone = ordersDto.map(order => {
                return {
                    ...order,
                    eventStartDate: removeTimeZone(order.eventStartDate),
                    createdAt: removeTimeZone(order.createdAt),
                };
            });
            return res.json(ordersWithoutTimeZone);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },
};
