import { UserService } from '../service/user';
import { RequestHandler } from 'express';

const userService = new UserService();

export const tokenGuard: (() => RequestHandler) = (() => (req, res, next) => {

        const token = req.headers.authorization as string || req.query.token || req.body.token || '';

        userService.verifyToken(token)
            .then(() => {
                res.locals.token = UserService.getTokenData(token);
                next();
            })
            .catch(() => res.status(403).send({ message: 'No access' }));
    }
);
