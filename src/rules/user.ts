import * as bcrypt from 'bcrypt';
import { user } from '../database/model/user';
import { check } from '../middleware/request-validator';

export const userRules = {
    forRegister: [
        check('mail', 'mail', mail =>
                user.count({ where: { mail } }).then(count => !count)
            , 'Email exists'),
        check('username', 'username', username =>
                user.count({ where: { username } }).then(count => !count)
            , 'Username exists'),
        check('password', 'password')
    ],
    forLogin: [
        check('mail', 'mail', mail =>
                user.count({ where: { mail } }).then(count => count)
            , 'Invalid mail or password'),
        check('password', 'password', (password, { req }) =>
                user.findOne({ where: { mail: req.body.mail } })
                    .then(user => bcrypt.compare(password, user!.password))
            , 'Invalid mail or password'
        )
    ]
};
