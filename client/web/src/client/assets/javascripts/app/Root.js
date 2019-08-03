// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import MainRouter from 'containers/routes/MainRouter';
// import LocaleProvider from 'antd/lib/locale-provider';

import App from './App';
import { SENTRY_URL } from './config';

import enUS from 'antd/lib/locale-provider/en_US';

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

//window.Raven && Raven.config(SENTRY_URL).install();

export default class Root extends React.PureComponent {
    static childContextTypes = {
        store: PropTypes.object,
        history: PropTypes.object,
    };

    getChildContext() {
        const { store, history } = this.props;
        return { store, history };
    }

    render() {
        const { store, history } = this.props;

        let ComponentEl = (
            <Provider store={store} locale={enUS}>
                <App history={history}>
                    <MainRouter history={history} />
                </App>
            </Provider>
        );
        if (process.env.NODE_ENV !== 'production') {
            ComponentEl = (
                <Provider store={store} locale={enUS}>
                    <App history={history}>
                        <MainRouter history={history} />
                    </App>
                </Provider>
            );
        }
        return ComponentEl;
    }
}

Root.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};
