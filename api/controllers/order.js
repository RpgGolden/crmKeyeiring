import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import Order from '../models/order.js';
import Client from '../models/client.js';
import OrderDto from '../dtos/order-dto.js';
import sendOrderConfirmationEmail from '../utils/mailer.js';
export default {
    async createOrder(req, res) {
        try {
            let {
                clientName,
                clientEmail,
                clientPhone,
                numberOfPeople,
                eventType,
                preferences,
                eventStartDate,
                budget,
                deliveryMethod,
                deliveryAddress,
            } = req.body;

            if (!numberOfPeople || !eventType || !eventStartDate || !budget || !deliveryMethod || !deliveryAddress) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const eventStartDateObj = new Date(eventStartDate);

            eventStartDateObj.setHours(eventStartDateObj.getHours() + 6);

            const formattedEventStartDate = eventStartDateObj.toISOString().slice(0, -5);

            let clientId;
            const existingUser = await Client.findOne({ where: { clientPhone } });

            if (existingUser) {
                clientId = existingUser.id;
                clientName = existingUser.clientName;
                clientEmail = existingUser.clientEmail;
                clientPhone = existingUser.clientPhone;
            } else {
                const client = await Client.create({
                    clientName,
                    clientEmail,
                    clientPhone,
                });
                clientId = client.id;
            }

            const order = await Order.create({
                clientId,
                clientName,
                clientEmail,
                clientPhone,
                numberOfPeople,
                eventType,
                preferences: preferences || '',
                eventStartDate: formattedEventStartDate,
                budget,
                deliveryMethod,
                deliveryAddress,
            });

            await order.reload({ include: [Client] });
            const orderDto = new OrderDto(order);
            const mailData = formattedEventStartDate.replace('T', ' ');
            const [datePart, time] = mailData.split(' ');
            const date = datePart.split('-').reverse().join('.');
            const concateDate = `${date} в ${time}`;

            // if (process.env.SMTP === 'true') {
            //     await sendOrderConfirmationEmail(
            //         clientEmail,
            //         clientName,
            //         clientPhone,
            //         numberOfPeople,
            //         eventType,
            //         concateDate
            //     );
            // }

            return res.json(orderDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
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
            const order = await Order.findByPk(id, { include: [Client] });

            if (!order) {
                return res.status(400).json({ error: 'Такого заказа не существует' });
            }

            if (order.status === 'canceled' || order.status === 'completed' || order.status === 'declined') {
                return res.status(400).json({ error: 'Заказ уже завершен' });
            }

            const {
                clientName,
                clientEmail,
                clientPhone,
                numberOfPeople,
                eventType,
                preferences,
                eventStartDate,
                budget,
                deliveryMethod,
                deliveryAddress,
            } = req.body;

            const client = await Client.findByPk(order.clientId);

            if (client) {
                client.clientName = clientName || client.clientName;
                client.clientEmail = clientEmail || client.clientEmail;
                client.clientPhone = clientPhone || client.clientPhone;
                await client.save();
            }

            order.numberOfPeople = numberOfPeople || order.numberOfPeople;
            order.eventType = eventType || order.eventType;
            order.preferences = preferences || order.preferences;
            order.eventStartDate = eventStartDate || order.eventStartDate;
            order.budget = budget || order.budget;
            order.deliveryMethod = deliveryMethod || order.deliveryMethod;
            order.deliveryAddress = deliveryAddress || order.deliveryAddress;

            await order.save();

            await order.reload({ include: [Client] });
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
            const order = await Order.findByPk(id, { include: [Client] });
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

    async getMany(req, res) {
        try {
            const orders = await Order.findAll({ include: [Client] });
            const ordersDto = orders.map(order => new OrderDto(order));
            return res.json(ordersDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
