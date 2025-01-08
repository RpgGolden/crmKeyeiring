import { models } from './index.js';
const { User, TokenSchema, Client, Order, FeedBack } = models;

export default function () {
    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });
    Client.hasMany(Order, { foreignKey: 'clientId', onDelete: 'cascade' });
    Order.belongsTo(Client, { foreignKey: 'clientId' });
    Client.hasMany(FeedBack, { foreignKey: 'clientId', onDelete: 'cascade' });
    FeedBack.belongsTo(Client, { foreignKey: 'clientId' });
}
