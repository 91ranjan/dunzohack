import React from 'react';
import { AcpContext } from 'context/acpContext';

export default class HasPermission extends React.PureComponent {
    static contextType = AcpContext;

    render() {
        const acp = this.context;
        const { feature, entity, operation } = this.props;
        if (acp.hasPermission(feature, entity, operation)) {
            return this.props.children;
        } else {
            return null;
        }
    }
}
