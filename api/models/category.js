// models/Category.js
import { DataTypes, Model } from 'sequelize';

export default class Category extends Model {
    static initialize(sequelize) {
        Category.init(
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
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Category',
                tableName: 'categories',
                timestamps: false,
            }
        );
    }
}
