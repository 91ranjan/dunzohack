import React from "react";

const RESERVED_FUNCTIONS = ["constructor"];

export class Analyzer extends React.PureComponent {
    constructor(props) {
        super(props);
        self = this;
        this._wrapMethods(self);
    }

    _wrapMethods = () => {
        let props = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        props = props.filter(prop => RESERVED_FUNCTIONS.indexOf(prop) < 0);
        props.forEach(prop => {
            const _localCopy = this[prop].bind(this);
            this[prop] = function() {
                const start = performance.now();
                const response = _localCopy(...arguments);
                const end = performance.now();
                console.log(
                    `${this.constructor.name} => ${prop} : ${end - start} ms`
                );
                return response;
            };
        });
    };
}
