import * as puppeteer from 'puppeteer';
import JsonApi from './JsonApi';

// Chromium should be running
/// Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')

export default class Puppeteer {
    _browser;
    _page;
    _server;
    constructor() {
        this._server = new JsonApi();
    }

    async launch(path = '/Applications/Chromium.app/Contents/MacOS/Chromium') {
        let connection;
        try {
            const oldInstance = await this.getChromiumInstance();
            connection = oldInstance[0].webSocketDebuggerUrl;
        } catch (e) {
            console.log('No old instance of the browser...');
        }

        console.log('Launching browser...');
        const args = puppeteer
            .defaultArgs()
            .filter(arg => String(arg).toLowerCase() !== '--disable-extensions');

        if (connection) {
            try {
                this._browser = await puppeteer.connect({
                    browserWSEndpoint: connection,
                    executablePath: path,
                    headless: false,
                    args: [
                        '--load-extension=./extenstions/immutablejs',
                        '--remote-debugging-port=9222',
                    ],
                });
            } catch (e) {
                throw new Error(e);
            }
        } else {
            this._browser = await puppeteer.launch({
                executablePath: path,
                headless: false,
                args: [
                    '--load-extension=./extenstions/immutablejs',
                    '--remote-debugging-port=9222',
                ],
                defaultViewport: {
                    width: 1280,
                    height: 800,
                },
                devtools: false,
            });
        }
        console.log('Opening page...');
        const pages = await this._browser.pages();
        if (!pages.length) {
            this._page = await this._browser.newPage();
        } else {
            this._page = pages[0];
        }
        return this._page;
    }

    async getChromiumInstance() {
        return await this._server.get('http://localhost:9222/json').then(resp => {
            return JSON.parse(resp.text);
        });
    }

    async navigate(url) {
        console.log(`Navigating to ${url}...`);
        await this._page.goto(url, { waitUntil: 'load' });
        console.log(`Setting the viewport...`);
        await this._page.setViewport({ width: 1280, height: 800 });
        await this._page.bringToFront();
    }

    async startRecorder() {
        console.log(`Opening the recorder tool...`);
        await this._page.keyboard.down('ControlLeft');
        await this._page.keyboard.down('ShiftLeft');
        await this._page.keyboard.down('d');
        await this._page.keyboard.up('ControlLeft');
        await this._page.keyboard.up('ShiftLeft');
        await this._page.keyboard.up('d');
    }

    async uploadRecord(record, bugId) {
        console.log('Waiting for the recorder to open...');
        await this._page.waitForSelector('#uploadRecord', {
            visible: true,
        });

        console.log('Opening the upload modal...');
        await this._page.click('#uploadRecord', {
            button: 'left',
        });

        const recordInput = await this._page.$('.modal-body input[name="file-input-button"]');
        console.log('Uploading the record file...');
        await recordInput.uploadFile(`./${bugId}.json`);
        await this._page.waitFor(1000);

        console.log('Saving the record...');
        await this._page.click('.modal-footer button:first-child');
    }

    async playRecord() {
        await this._page.click("div[class^='managerecords__manageRecords'] button:nth-child(2)");
    }

    async closeBrowser() {
        await this._browser.close();
    }

    /**
     * // Load a URL, returning only when the <body> tag is present
        helpers.loadPage('http://www.google.com');

        // get the value of a HTML attribute
        helpers.getAttributeValue('body', 'class');

        // get a list of elements matching a query selector who's inner text matches param.
        helpers.getElementsContainingText('nav[role="navigation"] ul li a', 'Safety Boots');

        // get first elements matching a query selector who's inner text matches textToMatch param
        helpers.getFirstElementContainingText('nav[role="navigation"] ul li a', 'Safety Boots');

        // click element(s) that are not visible (useful in situations where a menu needs a hover before a child link appears)
        helpers.clickHiddenElement('nav[role="navigation"] ul li a','Safety Boots');

        // wait until a HTML attribute equals a particular value
        helpers.waitUntilAttributeEquals('html', 'data-busy', 'false', 5000);

        // wait until a HTML attribute exists
        helpers.waitUntilAttributeExists('html', 'data-busy', 5000);

        // wait until a HTML attribute no longer exists
        helpers.waitUntilAttributeDoesNotExists('html', 'data-busy', 5000);

        // get the content value of a :before pseudo element
        helpers.getPseudoElementBeforeValue('body header');

        // get the content value of a :after pseudo element
        helpers.getPseudoElementAfterValue('body header');

        // clear the cookies
        helpers.clearCookies();

        // clear both local and session storages
        helpers.clearStorages();

        // clear both cookies and storages
        helpers.clearCookiesAndStorages('body header');
     */
}
