import { game as gameModel } from '../database/model/game';

export class GameService {

    static getGameInfo({ id }) {

        return gameModel.findAll({ where: { id } });
    }

    static getDownloadLink({ id }) {

        return new Promise((resolve, reject) => {
            gameModel.findOne({ where: { id } })
                .then((game) => {
                    resolve(`https://codeload.github.com/${game.author}/${game.githubName}/zip/${game.authorizedCommit}`);
                })
                .catch(err => reject(err.message));
        });
    }
}
