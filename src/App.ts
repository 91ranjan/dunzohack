import * as express from 'express';
import * as mongoose from 'mongoose';
import * as nconf from 'nconf';
import * as bluebird from 'bluebird';
import * as activedirectory from 'activedirectory';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'tracer';
// import { Basics } from './definitions/blueprint';

import config from '../config';

// Routes
import SearchRoute from './routes/search';
import RecieptRoute from './routes/reciepts';
import ProductRoute from './routes/product';

nconf
    .argv()
    .env()
const _console = logger.colorConsole();

class App {
    express;
    _jira;
    _puppet;
    _routes;
    _server;

    async _init() {
        this.express = express();
        this._initExpress();
        await this._initDb();
        // Cache.init();
        this._routes = [];
        this.mountRoutes();
        this._server = this.express;
    }

    _initExpress() {
        this.express.use(morgan('common'));
        this.express.use(compression());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));

        this.express.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            //res.header("Access-Control-Allow-Origin", nconf.get('siteBaseUrl'));
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );

            if (req.method == 'OPTIONS') {
                res.send().status(200);
            } else {
                next();
            }
        });
    }

    async _initDb() {
        (<any>mongoose).Promise = bluebird;
        (<any>mongoose).connect('mongodb://localhost:27017/dunzo');
        // (<any>mongoose).connect('mongodb://10.46.34.233:27017/calmmanager');
    }

    mountRoutes(): void {
        const searchApis = new SearchRoute(this._jira, this._puppet).router;
        const recieptApis = new RecieptRoute(this._jira, this._puppet).router;
        const productApis = new ProductRoute(this._jira, this._puppet).router;

        this.express.use('/search', searchApis);
        this.express.use('/reciept', recieptApis);
        this.express.use('/product', productApis);
    }
}

function exitHandler(option) {
    _console.error('Exiting App.');
    if (option.exit) {
        _console.log('Dumping ACP cache.');
        // Cache.dump();
    }
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

export default new App();
