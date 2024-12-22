import { models } from './index.js';
const { User, TokenSchema, Client, Order } = models;

export default function () {
    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });
    Client.hasMany(Order, { foreignKey: 'clientId' });
    Order.belongsTo(Client, { foreignKey: 'clientId' });
}
