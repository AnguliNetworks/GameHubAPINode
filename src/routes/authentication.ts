import { Router } from 'express';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';

export const router = Router();
const userService = new UserService();

router.post('/register', userRules.forRegister, (req, res) =>
    userService.register(req.body).then(r => r)
        .then(() => res.send({
            success: true,
            message: 'Dein Account wurde erstellt. Um Dich anzumelden, musst Du nur noch auf den Link in der Mail drücken, welche wir Dir zugeschickt haben..'
        }))
        .catch(error => res.status(500).send({ error })));

router.post('/login', userRules.forLogin, (req, res) => {
    userService.login(req.body)
        .then(token => res.json(token))
        .catch(error => res.status(500).send({ error }));
});
