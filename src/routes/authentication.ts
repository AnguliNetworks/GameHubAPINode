import { Router } from 'express';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';
import * as fs from 'fs';
import { tokenGuard } from '../middleware/token-guard';

export const router = Router();
const userService = new UserService();

router.post('/register', userRules.forRegister, (req, res) =>
    userService.register(req.body)
        .then(() =>
            res.json({
                success: true,
                message: 'Dein Account wurde erstellt. Um Dich anzumelden, musst Du nur noch auf den Link in der Mail drücken, welche wir Dir zugeschickt haben..'
            })
        )
        .catch(error => res.status(500).send({ error }))
);

router.get('/confirm/registration/:id', (req, res) =>
    userService.confirmAccount(req.params)
        .then(() => true)
        .catch(() => false)
        .then(success =>
            fs.readFile(`${__dirname}/../../resources/html/confirmationPage.html`, 'utf8', (err, data) => {

                let html;

                if (success) {
                    html = data.replace('${message}', 'Nice! Dein Account ist jetzt bestätigt! Du kannst diese Seite nun schließen.');
                } else {
                    html = data.replace('${message}', 'Diese Bestätigung ist nicht mehr gültig.');
                }

                res.send(html);
            })
        )
);

router.post('/login', userRules.forLogin, (req, res) =>
    userService.login(req.body)
        .then(token => res.json(token))
        .catch(error => res.status(500).send({ error }))
);

router.get('/authenticated', tokenGuard(), (req, res) => {
    res.status(200).json({ authenticated: true });
});
