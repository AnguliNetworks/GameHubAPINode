import { Router } from 'express';
import { GameService } from '../service/game';
import { gameRules } from '../rules/game';

export const router = Router();

router.post('/link', gameRules.forInfoAndLink, (req, res) =>
    GameService.getDownloadLink({ id: req.body.id })
        .then(link => res.json({ link }))
        .catch(err => res.status(500).send(err))
);

router.post('/info', gameRules.forInfoAndLink, (req, res) =>
    GameService.getGameInfo({ id: req.body.id })
        .then(answer => res.json(answer))
        .catch(err => res.status(500).send(err))
);
