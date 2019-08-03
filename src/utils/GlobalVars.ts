class GlobalVars {
    _vars;
    constructor() {
        this._vars = {};
    }

    set(key, value) {
        this._vars[key] = value;
    }

    get(key) {
        return this._vars[key];
    }

    delete(key) {
        delete this._vars[key];
    }
}

export default new GlobalVars();
