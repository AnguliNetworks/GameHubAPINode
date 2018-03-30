import { check } from '../middleware/request-validator';

export const friendshipRules = {
    addOrAccept: [
        check('username', 'username')
    ]
};
