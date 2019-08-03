import React from 'react';

import PageLayout from 'containers/PageLayout';

import Layout from 'features/Dashboard/layouts/Layout';

export default class Dashboard extends React.PureComponent {
    render() {
        return (
            <PageLayout activeNav="dashboard" {...this.props}>
                <Layout {...this.props} />
            </PageLayout>
        );
    }
}
