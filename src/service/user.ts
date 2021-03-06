import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { user as userModel, UserAddModel, UserViewModel } from '../database/model/user';
import { ObjectId } from '../helper/objectId';
import { jwtSecret } from '../config';
import { MailService } from '../mail/service';
import { sequelize } from '../database/connector';
import formatDate from '../helper/formatDate';

export class UserService {

    private readonly saltrounds = 12;
    private mailService = new MailService();

    register({ mail, username, password }) {

        return new Promise((resolve, reject) =>
            bcrypt.hash(password, this.saltrounds)
                .then(hash =>
                    sequelize.transaction(transaction =>
                        userModel.create(
                            {
                                mail, username, id: new ObjectId().getValue(), password: hash
                            },
                            { transaction })
                    )
                        .then((user) => {
                                this.mailService.sendTemplate(
                                    mail,
                                    'Bestätige Deinen GameHubOne Account',
                                    'registration',
                                    { userId: user.id }
                                );
                                resolve();
                            }
                        )
                        .catch(err => reject(err))
                )
        );
    }

    confirmAccount({ id }: UserAddModel) {

        return new Promise((resolve, reject) =>
            sequelize.transaction(transaction =>
                userModel.update({ lastLogin: formatDate() }, {
                    transaction,
                    where: {
                        id, lastLogin: null
                    }
                })
            )
                .then((changedRows) => {

                    if (changedRows[0] !== 1) {
                        reject();
                        return;
                    }

                    resolve();
                })
                .catch(err => reject(err))
        );
    }

    login({ mail }: UserAddModel) {

        return new Promise((resolve, reject) =>
            userModel.findOne({
                where: { mail },
                attributes: ['id', 'mail']
            })
                .then((user) => {
                    const currentDate = formatDate();

                    sequelize.transaction(transaction =>
                        userModel.update({ lastLogin: currentDate }, {
                            transaction,
                            where: {
                                id: user.id,
                                lastLogin: {
                                    [sequelize.Op.ne]: null
                                }
                            }
                        })
                            .then((changedRows) => {
                                if (changedRows[0] !== 1) {
                                    throw new Error('Bitte bestätige Deinen Account');
                                }
                            })
                    )
                        .then(() => {
                            const { id, mail } = user;
                            resolve({
                                token: jwt.sign({ id, mail, lastLogin: currentDate }, jwtSecret)
                            });
                        })
                        .catch(err => reject(err.message));
                }));
    }

    static getUserInfo({ user }) {
        return userModel.findOne({
            where: {
                [Op.or]: [{ username: user }, { id: user }]
            },
            attributes: ['username', 'avatar']
        });
    }

    static updateAvatar({ user, url }) {
        return sequelize.transaction(transaction =>
            userModel.update({ avatar: url }, {
                transaction,
                where: {
                    id: user
                }
            })
        );
    }

    verifyToken(token: string) {

        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    reject();
                    return;
                }

                userModel.count({
                    where: {
                        id: decoded['id'],
                        mail: decoded['mail'],
                        lastLogin: decoded['lastLogin']
                    }
                })
                    .then((count) => {
                        if (count !== 1) {
                            reject();
                            return;
                        }
                        resolve();
                    })
                    .catch(() => reject());
            });
        });
    }


    static getTokenData(token: string) {

        return jwt.decode(token) as UserViewModel;
    }
}
