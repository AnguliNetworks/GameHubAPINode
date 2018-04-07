import * as https from 'https';
import { Router } from 'express';
import { imgur } from '../config';
import * as querystring from 'querystring';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';

export const router = Router();

// TODO ADD RULES
router.get('/info/:user', userRules.getUserInfo, (req, res) => {
    UserService.getUserInfo({ user: req.params.user === 'me' ? res.locals.token.id : req.params.user })
        .then(user => res.json(user))
        .catch(error => res.status(500).json({ error }));
});

router.post('/avatar', userRules.changeAvatar, (req, res) => {

    const request = https.request(
        {
            method: 'POST',
            hostname: 'api.imgur.com',
            path: '/3/image',
            headers: {
                Authorization: `Client-ID ${imgur.clientId}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }


        },
        (resolve) => {
            const chunks = [];

            resolve.on('data', chunk => chunks.push(chunk));

            resolve.on('end', () => {
                const answer = JSON.parse(Buffer.concat(chunks).toString());
                if (answer.success) {
                    UserService.updateAvatar({
                        user: res.locals.token.id,
                        url: answer.data.link
                    })
                        .then(() => res.json({ message: 'Dein Avatar wurde geändert.' }))
                        .catch(error => res.status(500).json({ error }));
                } else {
                    res.status(500).json({ error: answer.data.error });
                }
            });
        });


    request.write(querystring.stringify({
        image: req.body.avatar.replace(/^data:image\/(jpeg|png);base64,/, '')
    }));
    request.end();
});
