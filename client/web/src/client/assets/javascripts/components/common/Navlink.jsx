import './navlinks.scss';

import React from 'react';
import PropTypes from 'prop-types';
import cns from 'classnames';

const BASE_PATH = '/';

export default class Navlink extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    render() {
        const className = cns('ulic_nav_link', this.props.className);
        const href = BASE_PATH + this.props.href;
        return (
            <a onClick={this.onClick} className={className} title={this.props.title} href={href}>
                {this.props.children}
            </a>
        );
    }

    onClick = e => {
        e.preventDefault();
        const href = BASE_PATH + this.props.href;
        const { history } = this.context;
        history.push(href);
    };
}
