import { Router } from 'express';
import { GameService } from '../service/game';

export const router = Router();

router.post('/link', (req, res) =>
    GameService.getDownloadLink({ id: req.body.id })
        .then(link => res.json({ link }))
        .catch(err => res.status(500).send(err))
);

router.post('/info', (req, res) =>
    GameService.getGameInfo({ id: req.body.id })
        .then(answer => res.json(answer))
        .catch(err => res.status(500).send(err))
);
