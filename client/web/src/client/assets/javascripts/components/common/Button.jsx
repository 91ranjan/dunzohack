import './button.scss';

import React from 'react';

import AntdButton from 'antd/lib/button';
import PropTypes from 'prop-types';
import Omit from 'object.omit';
import cns from 'classnames';

const buttonOptions = [
    'href',
    'onClick',
    'fullLength',
    'className',
    'isPrimaryBordered',
    'isPrimary',
    'isDashed',
    'isLarge',
    'isPlain',
    'isPlain',
    'isGreen',
    'isFullWidth',
    'isYellow',
    'isYellowBordered',
    'isAbsolute',
];

export default class Button extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    render() {
        const props = Omit(this.props, buttonOptions);
        const classes = cns(this.props.className, {
            btn_primary: this.props.isPrimary,
            btn_plain: this.props.isPlain,
            btn_large: this.props.isLarge,
            btn_green: this.props.isGreen,
            btn_yellow: this.props.isYellow,
            btn_yellow_bordered: this.props.isYellowBordered,
            btn_full_width: this.props.isFullWidth,
        });
        return <AntdButton {...props} className={classes} onClick={this.onClick} />;
    }

    onClick = event => {
        this.props.onClick && this.props.onClick(event);

        if (!event.defaultPrevented && this.props.href) {
            if (this.props.isAbsolute) {
                window.location = this.props.href;
            } else {
                const { history } = this.context;
                history.push(this.props.href);
            }
        }
    };
}
