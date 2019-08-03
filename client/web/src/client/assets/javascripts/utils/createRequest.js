import * as JsonAPI from 'utils/JsonAPI';
import Immutable from 'immutable';

import { PushNotification, Status } from 'containers/Notifications';

export const createGetRequest = (url, data, opts = {}) => {
    let promise;
    /**
     * If there is data to mock mock the response
     */
    if (opts.successResponse) {
        promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ text: JSON.stringify(opts.successResponse) });
            }, 2000);
        });
    } else {
        promise = JsonAPI.get(url, data, opts);
    }

    return promise.then(
        resp => {
            try {
                const massagedResp = opts.massager
                    ? opts.massager(JSON.parse(resp.text))
                    : JSON.parse(resp.text);
                return [null, Immutable.fromJS(massagedResp)];
            } catch (e) {
                PushNotification('Server error', 'Unexpected error occured.', Status.FAILURE);
                // window.location = "/app/login";
            }
        },
        function(err) {
            handleUnAuth(err);
            return [
                Immutable.fromJS({
                    message: err.message,
                    method: err.method,
                    url: err.url,
                }),
                null,
            ];
        }
    );
};

export const createPostRequest = (url, data, opts = {}) => {
    let promise;
    /**
     * If there is data to mock mock the response
     */
    if (opts.successResponse) {
        promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ text: JSON.stringify(opts.successResponse) });
            }, 2000);
        });
    } else {
        promise = JsonAPI.post(url, data, opts);
    }
    return promise.then(
        function(resp) {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                return [null, Immutable.fromJS(JSON.parse(resp.text))];
            }
        },
        function(err) {
            const errorText = JSON.parse(err.response.text);
            handleUnAuth(err);
            return [
                Immutable.fromJS(
                    Object.assign({}, errorText, {
                        method: err.response.req.method,
                        url: err.response.req.url,
                    })
                ),
                null,
            ];
        }
    );
};

export const createDeleteRequest = (url, data, opts = {}) => {
    let promise;
    /**
     * If there is data to mock mock the response
     */
    if (opts.successResponse) {
        promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ text: JSON.stringify(opts.successResponse) });
            }, 2000);
        });
    } else {
        promise = JsonAPI.deleteReq(url, data, opts);
    }
    return promise.then(
        function(resp) {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                return [null, Immutable.fromJS(JSON.parse(resp.text))];
            }
        },
        function(err) {
            const errorText = JSON.parse(err.response.text);
            return [
                Immutable.fromJS(
                    Object.assign({}, errorText, {
                        method: err.response.req.method,
                        url: err.response.req.url,
                    })
                ),
                null,
            ];
        }
    );
};

export const createUploadRequest = (url, formData, opts = {}) => {
    const promise = JsonAPI.upload(url, formData, opts);
    //opts.handleResponse
    return promise.then(
        function(resp) {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                return [null, Immutable.fromJS(JSON.parse(resp.text))];
            }
        },
        function(err) {
            return [
                Immutable.fromJS({
                    message: err.message,
                    method: err.method,
                    url: err.url,
                }),
                null,
            ];
        }
    );
};

export const createPutRequest = (url, data, opts) => {
    if (Immutable.Iterable.isIterable(data)) {
        data = data.toJS();
    }
    return JsonAPI.put(url, data, opts).then(
        function(resp) {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                return [null, Immutable.fromJS(JSON.parse(resp.text))];
            }
        },
        function(err) {
            return [
                Immutable.fromJS({
                    message: err.message + ': ' + err.response.body.message,
                    method: 'PUT',
                    url: err.response.req.url,
                }),
                null,
            ];
        }
    );
};

function handleUnAuth(err) {
    if (err.status && parseInt(err.status / 100, 10) === 4) {
        // Un Authorized user
        if (PRODUCTION) {
            window.location = '/login';
        } else {
            // window.location = "/login";
        }
    } else {
        PushNotification('Server error', 'Unexpected error occured.', Status.FAILURE);
    }
}
