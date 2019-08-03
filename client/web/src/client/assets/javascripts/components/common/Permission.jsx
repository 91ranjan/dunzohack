import React from 'react';

import { connectDummy } from 'utils/connectDummy';
import * as AuthEntity from 'entities/AuthEntity'

@connectDummy('auth', AuthEntity)
export default class Permission extends React.PureComponent {
    render() {
        const { role } = this.props;
        if (this.props.auth.value.items.getIn(['currentUser', 'role']) === role) {
            return <span>{this.props.children}</span>;
        }
        return null;
    }
}