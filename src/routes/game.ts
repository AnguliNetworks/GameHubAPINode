import { Router } from 'express';
import { GameService } from '../service/game';
import { gameRules } from '../rules/game';
import { ObjectId } from '../helper/objectId';

export const router = Router();

router.get('/id', (req, res) => {
    res.send(new ObjectId().toString());
});

router.post('/page/:page', gameRules.hasPage, (req, res) => {
        GameService.getPage({ page: req.params.page })
            .then(answer => res.json(answer))
            .catch(err => res.status(500).send(err));
    }
);

router.post('/link', gameRules.hasId, (req, res) =>
    GameService.getDownloadLink({ id: req.body.id })
        .then(link => res.json({ link }))
        .catch(err => res.status(500).send(err))
);

router.post('/info', gameRules.hasId, (req, res) =>
    GameService.getGameInfo({ id: req.body.id })
        .then(answer => res.json(answer))
        .catch(err => res.status(500).send(err))
);
