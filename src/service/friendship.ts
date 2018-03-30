import { friendship as friendshipModel } from '../database/model/friendship';
import { Op } from 'sequelize';

export class FriendshipService {

    static getFriendList({ user }) {
        return friendshipModel.findAll({
            where: {
                [Op.or]: [{ wantsToBe: user }, { couldBe: user }],
                accepted: true
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
                    console.log(friendRequest);

                    if (friendRequest.accepted) {
                        reject('Ihr seid bereits befreundet.');
                        return;
                    }

                    // TODO HANDLE REST OF FRIEND STUFF
                })
                .catch(err => reject(err));
        });
    }

}
