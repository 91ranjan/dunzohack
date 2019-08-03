import * as express from 'express';
import * as Cucumber from 'cucumber';
import * as mongoose from 'mongoose';
import * as nconf from 'nconf';
import * as bluebird from 'bluebird';
import * as activedirectory from 'activedirectory';
import Puppet from './utils/puppeteer';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'tracer';
// import { Basics } from './definitions/blueprint';

import LicenseManager from "./utils/LicenseManager";
import config from '../config';
import GlobalVars from './utils/GlobalVars';
import Cache from './utils/Cache';

// Routes
import SearchRoute from './routes/search';

nconf
    .argv()
    .env()
const _console = logger.colorConsole();

// Loading nconf for the application
Object.keys(config).forEach(key => {
    GlobalVars.set(key, config[key]);
})


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
        Cache.init();
        this._puppet = new Puppet();
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
        (<any>mongoose).connect('mongodb://localhost:27017/testmanager_1');
        // (<any>mongoose).connect('mongodb://10.46.34.233:27017/calmmanager');
    }

    mountRoutes(): void {
        const searchApis = new SearchRoute(this._jira, this._puppet).router;

        this.express.use('/search', searchApis);
    }
}

function exitHandler(option) {
    _console.error('Exiting App.');
    if (option.exit) {
        _console.log('Dumping ACP cache.');
        Cache.dump();
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
