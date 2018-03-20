import { UserService } from '../service/user';
import { IncomingHttpHeaders } from 'http';
import { RequestHandler } from 'express';

const userService = new UserService();

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
    const header = headers.authorization as string;

    if (!header) {
        return header;
    }

    return header.split(' ')[1];
}

export const tokenGuard: (() => RequestHandler) = (() => (req, res, next) =>
        userService.verifyToken(getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '')
            .then(next)
            .catch(() => res.status(403).send({ message: 'No access' }))
);
