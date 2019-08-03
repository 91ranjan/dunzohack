import { Map } from 'immutable';

import {
    createGetRequest,
    createPostRequest,
    createDeleteRequest,
    createUploadRequest,
    createPutRequest,
} from './createRequest';

import { createItemReducer, createListReducer, createUiReducer } from 'utils/createReducers';

import createGetReducer from './reducers/createGetReducer';
import createPostReducer from './reducers/createPostReducer';
import createPutReducer from './reducers/createPutReducer';
import createCreateLocalReducer from './reducers/createCreateLocalReducer';
import createUpdateLocalReducer from './reducers/createUpdateLocalReducer';
import createDiscardLocalReducer from './reducers/createDiscardLocalReducer';
import createDeleteReducer from './reducers/createDeleteReducer';

export const createGetAction = (url, query, opts = {}) => {
    return {
        request: payload => {
            const queryUrl = typeof url === 'function' ? url(payload) : url;
            const queryParams = typeof query === 'function' ? query(payload) : query;
            return createGetRequest(queryUrl, queryParams, opts);
        },
        reducer: config => createGetReducer(config),
        __type__: 'get',
    };
};

export const createSaveAction = (url, data, opts = {}) => {
    return {
        request: payload => {
            const queryUrl = typeof url === 'function' ? url(payload) : url;
            const postData = typeof data === 'function' ? data(payload) : data;
            return createPostRequest(queryUrl, postData, opts);
        },
        reducer: config => createPostReducer(config),
        __type__: 'post',
    };
};

export const createUpdateAction = (url, data, opts = {}) => {
    return {
        request: payload => {
            const queryUrl = typeof url === 'function' ? url(payload) : url;
            const putData = typeof data === 'function' ? data(payload) : data;
            return createPutRequest(queryUrl, putData, opts);
        },
        reducer: config => createPutReducer(config),
        __type__: 'put',
    };
};

export const createDeleteAction = (url, data, opts = {}) => {
    return {
        request: payload => {
            const queryUrl = typeof url === 'function' ? url(payload) : url;
            return createDeleteRequest(queryUrl, {}, opts);
        },
        reducer: config => createDeleteReducer(config),
        __type__: 'delete',
    };
};

export const createCreateLocalAction = () => {
    return {
        reducer: config => createCreateLocalReducer(config),
        isLocalAction: true,
    };
};

export const createUpdateLocalAction = () => {
    return {
        reducer: config => createUpdateLocalReducer(config),
        isLocalAction: true,
    };
};

export const createDicardLocalAction = () => {
    return {
        reducer: config => createDiscardLocalReducer(config),
        isLocalAction: true,
    };
};
