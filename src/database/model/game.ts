import * as Sequelize from 'sequelize';
import { sequelize } from '../connector';

export interface GameAddModel {
    id?: string;
    name?: string;
    author?: string;
    icon?: string;
    githubName?: string;
    authorizedCommit?: string;
}

export interface GameModel extends Sequelize.Model<GameModel, GameAddModel> {
    id: string;
    name: string;
    author?: string;
    icon?: string;
    githubName?: string;
    authorizedCommit?: string;
}

export const game = sequelize.define<GameModel, GameAddModel>('game', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING,
    author: Sequelize.STRING,
    icon: Sequelize.STRING,
    githubName: {
        type: Sequelize.STRING,
        field: 'github_name'
    },
    authorizedCommit: {
        type: Sequelize.STRING,
        field: 'authorized_commit'
    }
});
