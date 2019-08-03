import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';

import createRootReducer from '../reducer';
import { routerMiddleware } from 'react-router-redux';

const createStoreEnhancer = function(storeMiddlewares) {
    return compose(applyMiddleware(...storeMiddlewares));
};

export default function configureStore(history, initialState) {
    const middlewares = [promiseMiddleware, routerMiddleware(history)];
    return createStore(createRootReducer(), initialState, createStoreEnhancer(middlewares));
}
