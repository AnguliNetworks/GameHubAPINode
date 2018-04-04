import { Router } from 'express';
import { GameService } from '../service/game';
import { gameRules } from '../rules/game';
import { ObjectId } from '../helper/objectId';

export const router = Router();

// TODO REMOVE DEBUG ENDPOINT
router.get('/id', (req, res) => {
    res.send(new ObjectId().toString());
});

router.get('/page/:page', gameRules.hasPage, (req, res) => {
        GameService.getPage({ page: req.params.page })
            .then(answer => res.json(answer))
            .catch(err => res.status(500).send(err));
    }
);

router.get('/link/:id', gameRules.hasId, (req, res) =>
    GameService.getDownloadLink({ id: req.params.id })
        .then(link => res.json({ link }))
        .catch(err => res.status(500).send(err))
);

router.get('/info/:id', gameRules.hasId, (req, res) =>
    GameService.getGameInfo({ id: req.params.id })
        .then(answer => res.json(answer))
        .catch(err => res.status(500).send(err))
);
