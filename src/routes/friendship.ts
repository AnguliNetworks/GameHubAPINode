import { Router } from 'express';
import { friendshipRules } from '../rules/friendship';
import { user as userModel } from '../database/model/user';
import { UserService } from '../service/user';
import { FriendshipService } from '../service/friendship';

export const router = Router();

router.get('/requests', (req, res) =>
    FriendshipService.getRequests({ user: UserService.getTokenData(req.query.token).id })
        .then(list => res.json(list))
        .catch(error => res.status(500).json({ error }))
);

router.get('/list', (req, res) =>
    FriendshipService.getFriendList({ user: UserService.getTokenData(req.query.token).id })
        .then(list => res.json(list))
        .catch(error => res.status(500).json({ error }))
);

router.post(['/add', '/accept'], friendshipRules.addOrAccept, (req, res) =>
    userModel.findOne({
        where: { username: req.body.username }
    })
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: 'Der User wurde nicht gefunden.' });
                return;
            }

            const himself = UserService.getTokenData(req.body.token).id;

            if (user.id === himself) {
                res.status(418).json({ error: 'Du Scherzkeks!' });
                return;
            }

            FriendshipService.addFriendOrAcceptRequest({ wantsToBe: himself, couldBe: user.id })
                .then(message => res.json({ message }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
);
