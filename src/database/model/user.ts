import * as Sequelize from 'sequelize';
import { sequelize } from '../connector';

export interface UserAddModel {
    id?: string;
    mail?: string;
    username?: string;
    password?: string;
    lastLogin?: string;
}

export interface UserViewModel {
    id: string;
    username: string;
    lastLogin: string;
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: string;
    mail: string;
    username: string;
    password: string;
    lastLogin: string;
}

export const user = sequelize.define<UserModel, UserAddModel>('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    mail: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    lastLogin: 'TIMESTAMP'
});
