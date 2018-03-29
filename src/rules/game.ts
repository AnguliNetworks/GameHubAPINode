import { check } from '../middleware/request-validator';

export const gameRules = {
    forInfoAndLink: [
        check('id', 'none')
    ]
};
