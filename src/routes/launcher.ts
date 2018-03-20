import { Router } from 'express';
import { UserService } from '../service/user';

export const router = Router();

router.get('', (req, res) => {

    // TODO FINISH IT :D
    res.json(UserService.getTokenData(req.query.token));

});
