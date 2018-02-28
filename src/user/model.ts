import { DataTypes, Instance, Model, Sequelize } from 'sequelize';

module.exports = function (sequelize: Sequelize, dataTypes: DataTypes) {
    return sequelize.define<userInstance, userAttribute>('user', {
        id: {
            type: dataTypes.STRING(24),
            allowNull: false,
            primaryKey: true
        },
        mail: {
            type: dataTypes.STRING(254),
            allowNull: false
        },
        username: {
            type: dataTypes.STRING(64),
            allowNull: false
        },
        password: {
            type: dataTypes.STRING(256),
            allowNull: false
        }
    });
};

interface userAttribute {
    id: string;
    mail: string;
    username: string;
    password: string;
}

interface userInstance extends Instance<userAttribute>, userAttribute {
}

interface userModel extends Model<userInstance, userAttribute> {
}
