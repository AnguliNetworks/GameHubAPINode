import * as bcrypt from 'bcrypt';
import { user } from '../database/model/user';
import { check } from '../middleware/request-validator';

export const userRules = {
        forRegister: [
            check('mail', 'mail', mail => new Promise((resolve, reject) =>
                    user.count({ where: { mail } }).then((count) => {
                        if (count === 0) {
                            resolve();
                        } else {
                            reject();
                        }
                    }))
                , 'Die Mail ist bereits registriert.'),
            check('username', 'username', username => new Promise((resolve, reject) =>
                    user.count({ where: { username } }).then((count) => {
                        if (count === 0) {
                            resolve();
                        } else {
                            reject();
                        }
                    }))
                , 'Der Nutzername ist leider schon vergeben.'),
            check('password', 'password')
        ],
        forLogin: [
            check('mail', 'mail', mail => new Promise((resolve, reject) =>
                    user.count({ where: { mail } }).then((count) => {
                        if (count === 1) {
                            resolve();
                        } else {
                            reject();
                        }
                    }))
                , 'Die Mailadresse oder das Passwort ist falsch.'),
            check('password', 'password', (password, { req }) =>
                    new Promise((resolve, reject) =>
                        user.findOne({
                            where: { mail: req.body.mail },
                            attributes: ['password']
                        })
                            .then((user) => {
                                bcrypt.compare(password, user.password)
                                    .then((success) => {
                                        if (success) {
                                            resolve();
                                        } else {
                                            reject();
                                        }
                                    });
                            })
                    )
                , 'Die Mailadresse oder das Passwort ist falsch.'
            )
        ],
        getUserInfo: [
            check('user', 'none')
        ],
        changeAvatar: [
            check('avatar', 'none')
        ]
    }
;
