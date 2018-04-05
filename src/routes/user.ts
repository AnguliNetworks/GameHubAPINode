import * as https from 'https';
import { Router } from 'express';
import { imgur } from '../config';
import * as querystring from 'querystring';
import { UserService } from '../service/user';
import { userRules } from '../rules/user';

export const router = Router();

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
                UserService.updateAvatar({
                    user: res.locals.token.id,
                    url: JSON.parse(Buffer.concat(chunks).toString()).data.link
                })
                    .then(() => res.json({ message: 'Dein Avatar wurde geändert.' }))
                    .catch(error => res.json({ err: error }));
            });
        });


    request.write(querystring.stringify({
        image: req.body.avatar.replace(/^data:image\/png;base64,/, '')
    }));
    request.end();
});
