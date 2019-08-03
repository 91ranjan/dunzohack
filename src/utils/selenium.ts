import { Builder, By, Key, until } from 'selenium-webdriver';
// const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

export default class Selenium {
    constructor() {}

    openBrowser() {
        let driver = new Builder().forBrowser('chrome').build();
        driver
            .get('http://localhost:3000/')
            // .then(_ =>
            //     driver
            //         .findElement(By.name('q'))
            //         .sendKeys('webdriver', Key.RETURN)
            // )
            // .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
            .then(_ => driver.quit());
    }
}
