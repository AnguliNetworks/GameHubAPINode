import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import { router as authenticationRouter } from './routes/authentication';
import { router as statusRouter } from './routes/status';
import { router as launcherRouter } from './routes/launcher';
import { tokenGuard } from './middleware/token-guard';

export class App {
    protected app: express.Application;

    constructor(NODE_ENV: string = 'development', PORT: string = '8080') {

        process.env.NODE_ENV = process.env.NODE_ENV || NODE_ENV;
        process.env.PORT = process.env.PORT || PORT;

        this.app = express();
        this.app.use(helmet.noCache());
        this.app.use(cors());

        if (NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(compression());
        }

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());

        this.app.use('/status', statusRouter);
        this.app.use('/', authenticationRouter);

        this.app.use(tokenGuard());

        this.app.use('/launcher', launcherRouter);

        this.app.listen(process.env.PORT, () => {
            console.log('The server is running under localhost:', process.env.PORT);
        });
    }
}
