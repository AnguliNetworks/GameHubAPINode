import { game as gameModel } from '../database/model/game';

export class GameService {

    static getGameInfo = ({ id }) => gameModel.findAll({ where: { id } });

    static getPage({ page }) {
        return gameModel.findAll({
            offset: page * 10 - 10,
            limit: 10,
            order: [['id', 'DESC']]
        });
    }

    static getDownloadLink({ id }) {
        return new Promise((resolve, reject) =>
            gameModel.findOne({ where: { id } })
                .then((game) => {
                    resolve(`https://codeload.github.com/${game.author}/${game.githubName}/zip/${game.authorizedCommit}`);
                })
                .catch(err => reject(err.message))
        );
    }
}
