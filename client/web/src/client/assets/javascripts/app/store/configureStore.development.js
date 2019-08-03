import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger';

import createRootReducer from '../reducer';

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */
const logger = createLogger();

const createStoreEnhancer = function(storeMiddlewares) {
    return compose(applyMiddleware(...storeMiddlewares));
};

export default function configureStore(history, initialState) {
    const middlewares = [promiseMiddleware, logger];
    const store = createStore(createRootReducer(), initialState, createStoreEnhancer(middlewares));

    // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../reducer', () => {
            const nextReducer = require('../reducer').default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
