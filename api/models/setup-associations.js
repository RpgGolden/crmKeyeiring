import { models } from './index.js';
const { User, TokenSchema, Order, FeedBack, Category, Dish, OrderDish } = models;

export default function () {
    // User and TokenSchema associations
    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });

    // User and Order associations
    User.hasMany(Order, { foreignKey: 'clientId', onDelete: 'cascade' });
    Order.belongsTo(User, { foreignKey: 'clientId' });

    // User and FeedBack associations
    User.hasMany(FeedBack, { foreignKey: 'clientId', onDelete: 'cascade' });
    FeedBack.belongsTo(User, { foreignKey: 'clientId' });

    // Category and Dish associations
    Category.hasMany(Dish, { foreignKey: 'categoryId' });
    Dish.belongsTo(Category, { foreignKey: 'categoryId' });

    // Order and Dish many-to-many associations
    Order.belongsToMany(Dish, { through: OrderDish, foreignKey: 'orderId' });
    Dish.belongsToMany(Order, { through: OrderDish, foreignKey: 'dishId' });
}
