// models/Dish.js
import { DataTypes, Model } from 'sequelize';

export default class Dish extends Model {
    static initialize(sequelize) {
        Dish.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                },
                price: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'categories',
                        key: 'id',
                    },
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Dish',
                tableName: 'dishes',
                timestamps: false,
            }
        );
    }
}
