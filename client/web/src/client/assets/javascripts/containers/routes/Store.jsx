import React from 'react';

import PageLayout from 'containers/PageLayout';

import Layout from 'features/Dashboard/layouts/Store';

export default class Store extends React.PureComponent {
    render() {
        return (
            <PageLayout {...this.props}>
                <Layout {...this.props} />
            </PageLayout>
        );
    }
}
