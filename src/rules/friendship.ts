import { Op } from 'sequelize';
import { check } from '../middleware/request-validator';
import { user as userModel } from '../database/model/user';

export const friendshipRules = {
    addOrRemove: [
        check(
            'username', 'username',
            (username, { req, res }) => new Promise((resolve, reject) =>
                userModel.findOne({
                    where: {
                        username,
                        lastLogin: {
                            [Op.ne]: null
                        }
                    },
                    attributes: ['id']
                })
                    .then((user) => {
                        if (!user) {
                            reject({
                                code: 404,
                                message: 'Der User wurde nicht gefunden.'
                            });
                            return;
                        }

                        if (user.id === res.locals.token.id) {
                            reject({
                                code: 418,
                                message: 'Du Scherzkeks!'
                            });
                            return;
                        }

                        req.body.userId = user.id;
                        resolve(true);
                    })
            )
        )
    ]
};
