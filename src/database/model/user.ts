import * as Sequelize from 'sequelize';
import { sequelize } from '../connector';

export interface UserAddModel {
    id: string;
    mail: string;
    username: string;
    password: string;
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: string;
    mail: string;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserViewModel {
    id: string;
    username: string;
    createdAt: string;
}

export const user = sequelize.define<UserModel, UserAddModel>('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    mail: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});
