import 'antd/dist/antd.min.css';
import './app.scss';
import './form.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { connectDummy } from 'utils/connectDummy';
import Notifications from 'containers/Notifications';
import MainRouter from '../containers/routes/MainRouter';

import * as UserEntity from 'entities/LoggedInUserEntity';

@connectDummy('user', UserEntity)
@connect(
    state => state['routing'],
    () => ({})
)
export default class App extends React.PureComponent {
    render() {
        const props = this.props;

        return (
            <div className="page-container">
                <Notifications />
                <Router {...props}>
                    <Switch>
                        <Route path="/" component={MainRouter} />
                    </Switch>
                </Router>
            </div>
        );
    }
}
