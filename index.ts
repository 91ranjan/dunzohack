import config from './config';
import App from './src/App';
import { app, BrowserWindow } from 'electron';

const port = 3001;

(async function() {
    await App._init();
    App.express.listen(config.server_port, err => {
        if (err) {
            return console.log(err);
        }

        return console.log(`App server is listening on ${port}`);
    });
})();