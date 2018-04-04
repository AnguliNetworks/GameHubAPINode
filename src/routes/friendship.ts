import { Router } from 'express';
import { friendshipRules } from '../rules/friendship';
import { FriendshipService } from '../service/friendship';

export const router = Router();

router.get('/requests', (req, res) =>
    FriendshipService.getRequests({ user: res.locals.token.id })
        .then(list => res.json(list))
        .catch(error => res.status(500).json({ error }))
);

router.get('/list', (req, res) =>
    FriendshipService.getFriendList({ user: res.locals.token.id })
        .then(list => res.json(list))
        .catch(error => res.status(500).json({ error }))
);

router.post(['/add', '/accept'], friendshipRules.addOrRemove, (req, res) =>
    FriendshipService.addFriend({ wantsToBe: res.locals.token.id, couldBe: req.body.userId })
        .then(message => res.json({ message }))
        .catch(error => res.status(400).json({ error }))
);

router.delete(['/remove', '/decline'], friendshipRules.addOrRemove, (req, res) =>
    FriendshipService.removeFriend({ himself: res.locals.token.id, friend: req.body.userId })
        .then(message => res.json({ message }))
        .catch(error => res.status(400).json({ error }))
);
