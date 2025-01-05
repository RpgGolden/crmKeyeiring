import Client from '../models/client.js';
import ClientDto from '../dtos/client-dto.js';
import Order from '../models/order.js';
import FeedBackDto from '../dtos/feedback-dto.js';
import FeedBack from '../models/feedback.js';
import removeTimeZone from '../utils/removetimezone.js';
import path from 'path';
import FeedBackWZPhoneDto from '../dtos/feedback-withoutphone-dto.js';
import { AppErrorMissing } from '../utils/errors.js';
import ClientFeedBackDto from '../dtos/client-dto-feedback.js';
export default {
    async getClient(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID клиента не указан' });
            }
            const client = await Client.findByPk(id, { include: [Order, FeedBack] });
            if (!client) {
                return res.status(400).json({ error: 'Такого клиента не существует' });
            }
            const clientDto = new ClientFeedBackDto(client);
            // Удаляем временную зону из дат в заказах
            clientDto.orders = clientDto.orders.map(order => ({
                ...order,
                eventStartDate: removeTimeZone(order.eventStartDate),
                createdAt: removeTimeZone(order.createdAt),
            }));

            return res.json(clientDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllClients(req, res) {
        try {
            const clients = await Client.findAll({ include: [Order] });
            const clientsDto = clients.map(client => {
                const clientDto = new ClientDto(client);

                clientDto.orders = clientDto.orders.map(order => ({
                    ...order,
                    eventStartDate: removeTimeZone(order.eventStartDate),
                    createdAt: removeTimeZone(order.createdAt),
                }));
                clientDto.count = clientDto.orders.length;

                if (clientDto.orders.length > 0) {
                    clientDto.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    clientDto.lastOrderDate = clientDto.orders[0].createdAt;
                } else {
                    clientDto.lastOrderDate = undefined;
                }

                return clientDto;
            });

            return res.json(clientsDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteClient(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID клиента не указан' });
            }
            const client = await Client.findByPk(id, { include: [Order] });
            if (!client) {
                return res.status(400).json({ error: 'Такого клиента не существует' });
            }
            await client.destroy({ force: true });
            return res.json({ message: 'Клиент успешно удален' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getClientOrders(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID клиента не указан' });
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
            const client = await Client.findOne({ where: { clientPhone: phone } });
            if (!client) {
                throw new AppErrorMissing('Такого клиента не существует');
            }
            const image = req.file ? path.posix.join('uploads', req.file.filename) : null;

            const feedback = await FeedBack.create({ clientId: client.id, image, description, score });
            await feedback.reload({ include: [Client] });

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
                return res.status(400).json({ error: 'ID клиента не указан' });
            }
            const feedBack = await FeedBack.findByPk(id, { include: [Client] });
            const feedBackDto = new FeedBackDto(feedBack);
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getFeedBackCRM(req, res) {
        try {
            const feedBack = await FeedBack.findAll({ include: [Client] });
            const feedBackDto = feedBack.map(feedBack => new FeedBackDto(feedBack));
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getFeedBackAll(req, res) {
        try {
            const feedBack = await FeedBack.findAll({ include: [Client] });
            const feedBackDto = feedBack.map(feedBack => new FeedBackWZPhoneDto(feedBack));
            return res.json(feedBackDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
