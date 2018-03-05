import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { user, UserAddModel, UserViewModel } from '../database/model/user';
import { ObjectId } from '../objectId';
import * as Bluebird from 'bluebird';
import { jwtSecret } from '../config';

export class UserService {
    private readonly saltrounds = 12;

    static get userAttributes() {
        return ['id', 'username', 'createdAt'];
    }

    private static USER;

    static get user() {
        return UserService.USER;
    }

    register({ mail, username, password }: UserAddModel) {
        return bcrypt.hash(password, this.saltrounds)
            .then(hash =>
                user.create({
                    mail,
                    username,
                    id: new ObjectId().getValue(),
                    password: hash
                })
                    .then(() => true)
                    .catch(err => err)
            );
    }

    login({ mail }: UserAddModel) {
        return user.findOne({ where: { mail } })
            .then((user) => {
                const { id, mail } = user!;
                return { token: jwt.sign({ id, mail }, jwtSecret) };
            });
    }

    verifyToken(token: string) {
        return new Promise((resolve) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    resolve(false);
                    return;
                }

                UserService.USER = user.findById(decoded['id']);
                resolve(true);
            });
        }) as Promise<boolean>;
    }

    static getUserById(id: string) {
        return user.findById(id, {
            attributes: UserService.userAttributes
        }) as Bluebird<UserViewModel>;
    }
}
