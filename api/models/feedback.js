// models/Order.js
import { DataTypes, Model } from 'sequelize';

export default class FeedBack extends Model {
    static initialize(sequelize) {
        FeedBack.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    unique: true,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                clientId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                score: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 1,
                        max: 5,
                    },
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'FeedBack',
                tableName: 'feedbacks',
                paranoid: true,
            }
        );
    }
}
