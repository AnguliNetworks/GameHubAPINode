import { friendship as friendshipModel } from '../database/model/friendship';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../database/connector';

export class FriendshipService {

    static getRequests({ user }) {
        return sequelize.query(
            `SELECT \`users\`.\`username\`, \`users\`.\`avatar\`
                  FROM \`friendship\` AS \`friendship\`
                    JOIN \`users\` ON \`friendship\`.\`wants_to_be\` = \`users\`.\`id\`
                  WHERE \`friendship\`.\`accepted\` = FALSE AND \`friendship\`.\`could_be\` = ?;`,
            {
                replacements: [user],
                type: QueryTypes.SELECT
            }
        );
    }

    static getFriendList({ user }) {
        return sequelize.query(
            `SELECT 
                    CASE WHEN \`friendship\`.\`wants_to_be\` = ?
                        THEN c.username
                    ELSE w.username END AS 'name',
                    CASE WHEN \`friendship\`.\`wants_to_be\` = ?
                        THEN c.avatar
                    ELSE w.avatar END   AS 'avatar'
                  FROM \`friendship\` AS \`friendship\`
                    JOIN \`users\` AS w ON \`friendship\`.\`wants_to_be\` = w.\`id\`
                    JOIN \`users\` AS c ON \`friendship\`.\`could_be\` = c.\`id\`
                  WHERE
                    (\`friendship\`.\`wants_to_be\` = ? OR \`friendship\`.\`could_be\` = ?) AND \`friendship\`.\`accepted\` = TRUE;`,
            {
                replacements: [user, user, user, user],
                type: QueryTypes.SELECT
            }
        );
    }

    static addFriend({ wantsToBe, couldBe }) {
        return new Promise((resolve, reject) => {
            friendshipModel.findOne({
                where: {
                    [Op.or]:
                        [{ wantsToBe, couldBe }, { wantsToBe: couldBe, couldBe: wantsToBe }]
                }
            })
                .then((friendRequest) => {

                    if (!friendRequest) {
                        sequelize.transaction(transaction =>
                            friendshipModel.create(
                                {
                                    wantsToBe, couldBe
                                },
                                { transaction })
                        )
                            .then(() =>
                                resolve('Freundschaftsanfrage wurde verschickt')
                            );
                        return;
                    }

                    if (friendRequest.accepted) {
                        reject('Ihr seid bereits befreundet.');
                        return;
                    }

                    if (friendRequest.couldBe === wantsToBe) {
                        sequelize.transaction(transaction =>
                            friendRequest.update({ accepted: true }, {
                                transaction,
                                where: {
                                    wantsToBe: friendRequest.wantsToBe,
                                    couldBe: friendRequest.couldBe
                                }
                            })
                        )
                            .then(() => resolve('Freundschaftsanfrage bestätigt.'));
                        return;
                    }

                    reject('Du hast dem Nutzer bereits eine Freundschaftsanfrage geschickt. Warte bis er sie annimmt.');
                })
                .catch(err => reject(err));
        });
    }

    static removeFriend({ himself, friend }) {
        return new Promise((resolve, reject) =>
            friendshipModel.findOne({
                where: {
                    [Op.or]: [{ wantsToBe: friend, couldBe: himself }, { wantsToBe: himself, couldBe: friend }]
                }
            })
                .then((friendRequest) => {
                    if (!friendRequest) {
                        reject('Ihr seid gar nicht befreundet.');
                        return;
                    }

                    sequelize.transaction(transaction =>
                        friendRequest.destroy({ transaction })
                    )
                        .then(() =>
                            resolve(
                                friendRequest.accepted ?
                                    'Ihr seid jetzt nicht mehr befreundet.' :
                                    'Freundschaftsanfrage entfernt.'
                            )
                        )
                        .catch(err => reject(err));
                })
        );
    }
}
