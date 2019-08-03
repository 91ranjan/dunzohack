import keymirror from 'utils/keymirror';

export const txnStates = keymirror('INITIATED', 'PENDING', 'SUCCESS', 'FAILURE');

// Try using promises
class Tnx {
    _state = {};
    _callback = null;
    response = null;
    error = null;
    _success_callback = [];
    _failure_callback = [];

    setState = state => {
        this._state.last_state = this._state.current_state;
        this._state.current_state = state;
    };

    initiateTxn = () => {
        this.setState(txnStates.INITIATED);
    };

    setStatePending = () => {
        this.setState(txnStates.PENDING);
    };

    setStateFailure = (error) => {
        this.setState(txnStates.FAILURE);
        this.error = error;

        if (this._failure_callback.length) {
            this._failure_callback.forEach(cb => {
                cb(this);
            });
        }
    };

    setStateSuccess = response => {
        this.setState(txnStates.SUCCESS);
        this.response = response;

        if (this._success_callback.length) {
            this._success_callback.forEach(cb => {
                cb(this);
            });
        }
    };

    isSuccess = () => {
        var reg = new RegExp(/SUCCESS$/);
        return reg.test(this.getCurrentState());
    };

    isFailure = () => {
        var reg = new RegExp(/FAILURE$/);
        return reg.test(this.getCurrentState());
    };

    isPending = () => {
        var reg = new RegExp(/PENDING$/);
        return reg.test(this.getCurrentState());
    };

    isInitiated = () => {
        var reg = new RegExp(/INITIATED$/);
        return reg.test(this.getCurrentState());
    };

    onChange = callback => {
        this._success_callback.push(callback);
    };

    onSuccess = callback => {
        this._success_callback.push(callback);
    };

    onFailure = callback => {
        this._failure_callback.push(callback);
    };

    getCurrentState = () => {
        return this._state.current_state;
    };
}

export const createTransaction = () => {
    return new Tnx();
};
