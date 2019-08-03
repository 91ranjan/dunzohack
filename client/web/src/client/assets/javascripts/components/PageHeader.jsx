import './pageheader.scss';

import React, { Fragment } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import PropTypes from 'prop-types';
import Navlink from 'components/common/Navlink';

export default class PageHeader extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    render() {
        const user = JSON.parse(localStorage.getItem('user'));
        const { release_id, product_id } = this.props;

        return (
            <div className="ulic_page_header_container">
                <div className="page_header_content">
                    <div className="pull-right welcome-user">Dunzo</div>
                    <div>abc@google.com</div>
                </div>
            </div>
        );
    }

    onLogout = () => {
        localStorage.removeItem('user');
        window.location = '/login';
    };

    onChangePass = () => {
        const { history } = this.context;
        history.push('/forgot-password');
    };
}
