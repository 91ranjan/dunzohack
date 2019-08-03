import React from 'react';

import PageLayout from 'containers/PageLayout';

import Layout from 'features/Notifications/layouts/Layout';

export default class NotificationsManagement extends React.PureComponent {
    render() {
        return (<PageLayout activeNav="mails">
            <Layout />
        </PageLayout>);
    }
}