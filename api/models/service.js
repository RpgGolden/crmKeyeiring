// models/Service.js
import { DataTypes, Model } from 'sequelize';

export default class Service extends Model {
    static initialize(sequelize) {
        Service.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
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
                isActive: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Service',
                tableName: 'services',
                paranoid: true,
            }
        );
    }
}
