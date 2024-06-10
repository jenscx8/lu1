import { DataTypes, Model } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';

export const db = await connectToDB('postgresql:///lineupv001');

// admin model
export class Admin extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Admin.init(
    {
        adminId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    },
    {
        modelName: 'admins',
        sequelize: db
    }
)