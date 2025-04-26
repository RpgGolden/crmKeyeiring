// models/OrderDish.js
import { DataTypes, Model } from 'sequelize';

export default class OrderDish extends Model {
    static initialize(sequelize) {
        OrderDish.init(
            {
                orderId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'orders',
                        key: 'id',
                    },
                },
                dishId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'dishes',
                        key: 'id',
                    },
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'OrderDish',
                tableName: 'order_dishes',
                timestamps: false,
            }
        );
    }
}
