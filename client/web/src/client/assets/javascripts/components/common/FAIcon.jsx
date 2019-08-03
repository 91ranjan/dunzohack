import './icon.scss';

import React from 'react';
import cns from 'classnames';

export default class FAIcon extends React.PureComponent {
    render() {
        const { className } = this.props;
        const classes = cns('do-icon', className);
        return <i className={classes} onClick={this.props.onClick} />;
    }
}
