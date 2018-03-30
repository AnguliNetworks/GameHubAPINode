import { friendship as friendshipModel } from '../database/model/friendship';
import { Op } from 'sequelize';
import { sequelize } from '../database/connector';

export class FriendshipService {

    static getFriendList({ user }) {
        return user.findAll({
            where: {
                id: user
            }
        });
    }

    static addFriendOrAcceptRequest({ wantsToBe, couldBe }) {
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
                            .then((friendRequest) => {
                                resolve('Freundschaftsanfrage wurde verschickt');
                            });
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

}
