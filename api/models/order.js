// models/Order.js
import { DataTypes, Model } from 'sequelize';

export default class Order extends Model {
    static initialize(sequelize) {
        Order.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                clientId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'clients',
                        key: 'id',
                    },
                },
                clientName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                clientEmail: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: true,
                    },
                },
                clientPhone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                numberOfPeople: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                eventType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                preferences: {
                    type: DataTypes.TEXT,
                },
                eventStartDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                budget: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                },
                deliveryMethod: {
                    type: DataTypes.ENUM('delivery', 'pickup'),
                    allowNull: false,
                },
                deliveryAddress: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.ENUM('pending', 'approved', 'declined', 'completed', 'canceled'),
                    allowNull: false,
                    defaultValue: 'pending',
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Order',
                tableName: 'orders',
                paranoid: true,
            }
        );
    }
}
