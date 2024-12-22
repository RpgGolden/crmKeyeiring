 // models/Order.js
 import { DataTypes, Model } from 'sequelize';
 
 export default class Client extends Model {
     static initialize(sequelize) {
         Client.init(
             {
                 id: {
                     type: DataTypes.UUID,
                     defaultValue: DataTypes.UUIDV4,
                     allowNull: false,
                     primaryKey: true,
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
             },
             {
                 sequelize,
                 schema: 'public',
                 modelName: 'Client',
                 tableName: 'clients',
                 paranoid: true,
             }
         );
     }
 }
 