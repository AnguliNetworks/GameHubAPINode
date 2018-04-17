import * as io from 'socket.io';
import * as http from 'http';
import { UserService } from '../service/user';

export class Socket {
    protected socket: io.Server;
    protected userService: UserService;
    protected user: Map<string, string>;

    constructor(app: http.Server) {
        this.socket = io(app);
        this.userService = new UserService();
        this.user = new Map<string, string>();

        this.socket.on('connection', (socket: io.Socket) => {

            let id = '';

            socket.on('authenticate', (data) => {
                this.userService.verifyToken(data.token)
                    .then((decoded) => {
                        id = decoded['id'];
                        this.user.set(id, socket.conn.id);
                        socket.send('authentication', { authenticated: true });
                    })
                    .catch(() => {
                        socket.send('authentication', { authenticated: false });
                    });
            });

            socket.on('disconnect', () => {
                this.user.delete(id);
            });
        });
    }
}
