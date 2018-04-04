import * as Sequelize from 'sequelize';
import { sequelize } from '../connector';
import { user } from './user';

// Thanks to 'Bennet - intranetproject.net#0001' from the c0debase Discord for the idea with the names.
export interface FriendshipAddModel {
    wantsToBe?: string;
    couldBe?: string;
    accepted?: boolean;
}

export interface FriendshipModel extends Sequelize.Model<FriendshipModel, FriendshipAddModel> {
    wantsToBe: string;
    couldBe: string;
    accepted: boolean;
}

export const friendship = sequelize.define<FriendshipModel, FriendshipAddModel>(
    'friendship',
    {
        wantsToBe: {
            type: Sequelize.STRING,
            field: 'wants_to_be',

            primaryKey: true,

            references: {
                model: user,
                key: 'id'
            }
        },
        couldBe: {
            type: Sequelize.STRING,
            field: 'could_be',

            primaryKey: true,

            references: {
                model: user,
                key: 'id'
            }
        },
        accepted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }

    },
    {
        tableName: 'friendship'
    });
