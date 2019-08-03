import { Map } from 'immutable';
import Puppet from '../utils/puppeteer';

export default class Context {
    private _keyMap;
    public _puppet;

    constructor() {
        this._keyMap = Map();
        this._puppet = new Puppet();
    }

    set(name, value) {
        this._keyMap.set(name, value);
    }

    get(name) {
        return this._keyMap.get(name);
    }

}
