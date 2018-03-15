import * as bcrypt from 'bcrypt';
import { user } from '../database/model/user';
import { check } from '../middleware/request-validator';

export const userRules = {
    forRegister: [
        check('mail', 'mail', mail =>
                user.count({ where: { mail } }).then(count => !count)
            , 'Die Mail ist bereits registriert.'),
        check('username', 'username', username =>
                user.count({ where: { username } }).then(count => !count)
            , 'Der Nutzername ist leider schon vergeben.'),
        check('password', 'password')
    ],
    forLogin: [
        check('mail', 'mail', mail =>
                user.count({ where: { mail } }).then(count => count)
            , 'Die Mailadresse oder das Passwort ist falsch.'),
        check('password', 'password', (password, { req }) =>
                user.findOne({ where: { mail: req.body.mail } })
                    .then(user => bcrypt.compare(password, user!.password))
            , 'Die Mailadresse oder das Passwort ist falsch.'
        )
    ]
};
