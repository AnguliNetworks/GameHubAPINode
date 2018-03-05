import { Router } from 'express';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';

export const router = Router();
const userService = new UserService();

router.post('/register', userRules.forRegister, (req, res) =>
    userService.register(req.body).then(r => r)
        .then(success => res.json({ success }))
        .catch(error => res.status(500).send({ error }))
);

router.post('/login', userRules.forLogin, (req, res) => {
    userService.login(req.body)
        .then(token => res.json(token))
        .catch(error => res.status(500).send({ error }));
});
