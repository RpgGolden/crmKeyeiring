import Client from '../models/client.js';
import ClientDto from '../dtos/client-dto.js';
import Order from '../models/order.js';
import removeTimeZone from '../utils/removetimezone.js';
export default {
    async getClient(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID клиента не указан' });
            }
            const client = await Client.findByPk(id, { include: [Order] });
            if (!client) {
                return res.status(400).json({ error: 'Такого клиента не существует' });
            }
            const clientDto = new ClientDto(client);

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
            console.log('client', client);
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
};
