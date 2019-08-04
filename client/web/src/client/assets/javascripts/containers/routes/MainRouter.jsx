import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

// getComponent is a function that returns a promise for a component
// It will not be called until the first mount
function asyncComponent(getComponent) {
    return class AsyncComponent extends React.Component {
        static Component = null;
        state = { Component: AsyncComponent.Component };

        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component;
                    this.setState({ Component });
                });
            }
        }
        render() {
            const { Component } = this.state;
            if (Component) {
                return <Component {...this.props} />;
            }
            return null;
        }
    };
}

const loadComp = path =>
    asyncComponent(() => {
        return import('containers/routes/' + path).then(module => module.default);
    });

// import Login from 'containers/routes/Login';
import Dashboard from 'containers/routes/Dashboard';
import Store from 'containers/routes/Store';
// import NoMatch from 'containers/routes/NoMatch';
// import Steps from 'containers/routes/Steps';
// import Flows from 'containers/routes/Flows';
// import Usecase from 'containers/routes/Usecase';
// import Features from 'containers/routes/Features';
// import Reports from 'containers/routes/Reports';
// import ReportsDetails from 'containers/routes/ReportsDetails';
// import Releases from 'containers/routes/Releases';
// import FeaturesEdit from 'containers/routes/FeaturesEdit';
// import FeatureReview from 'containers/routes/FeatureReview';
// import ReleasesEdit from 'containers/routes/ReleasesEdit';
// import FlowsEdit from 'containers/routes/FlowsEdit';
// import UsecaseEdit from 'containers/routes/UsecaseEdit';
// import ManageProducts from 'containers/routes/manager/ManageProducts';
// import ManageUsers from 'containers/routes/manager/ManageUsers';
// import EditProduct from 'containers/routes/manager/EditProduct';
// import EditUsers from 'containers/routes/manager/EditUsers';

export default class MainRouter extends React.PureComponent {
    render() {
        return (
            <Fragment>
                <Route path="/" exact={true} component={Dashboard} />
                <Route path="/store/:store_id" exact={true} component={Store} />
            </Fragment>
        );
    }
}
