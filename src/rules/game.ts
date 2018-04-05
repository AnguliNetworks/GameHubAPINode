import { check } from '../middleware/request-validator';

export const gameRules = {
    hasId: [
        check('id', 'none')
    ],
    hasPage: [
        check('page', 'int', number => new Promise((resolve, reject) => {
            if (number > 0) {
                resolve();
            } else {
                reject('Der Paramter `page` muss mindestens 1 sein.');
            }
        }))
    ]
};
