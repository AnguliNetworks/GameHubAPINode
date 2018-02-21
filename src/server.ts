import * as express from 'express';
import * as helmet from 'helmet';
import * as path from 'path';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import { Routes } from 'routes';

export class App {
    protected app: express.Application;

    constructor(NODE_ENV: string = 'development', PORT: number = 8080) {

        process.env.NODE_ENV = process.env.NODE_ENV || NODE_ENV;
        process.env.PORT = process.env.PORT || PORT;

        this.app = express();
        this.app.use(helmet.noCache());

        if (NODE_ENV === 'development') {
            this.app.use(express.static(path.join(process.cwd(), 'public')));
            this.app.use(morgan('dev' as morgan.FormatFn));
        } else {
            this.app.use(compression());
        }

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());

        new Routes().paths(this.app);

        this.app.listen(process.env.PORT, () => {
            console.log('The server is running on localhost:', process.env.PORT);
        });

    }
}
