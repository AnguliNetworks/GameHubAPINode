import { Router } from 'express';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';

export const router = Router();
const userService = new UserService();

router.post('/register', userRules.forRegister, (req, res) =>
    userService.register(req.body).then(r => r)
        .then(() => res.send({
            success: true,
            message: 'Dein Account wurde erstellt. Bitte bestätige Deine Mail, um Dich anmelden zu können.'
        }))
        .catch(error => res.status(500).send({ error })));

router.post('/login', userRules.forLogin, (req, res) => {
    userService.login(req.body)
        .then(token => res.json(token))
        .catch(error => res.status(500).send({ error }));
});
