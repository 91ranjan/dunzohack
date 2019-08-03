import './pagelayout.scss';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils/connect';
import cns from 'classnames';

export default class PageLayout extends React.PureComponent {
    state = {
        showNav: true,
        acp: null,
    };
    static contextTypes = {
        history: PropTypes.object,
    };
    componentWillMount() {
        if (!localStorage.getItem('user')) {
            window.location = '/login';
        }
    }

    render() {
        const classes = cns('page-content', {
            'full-width': !this.state.showNav,
        });

        return (
            <div className="default-page-layout">
                <div className={classes}>{this.props.children}</div>
            </div>
        );
    }

    onToggleNav = () => {
        this.setState({
            showNav: !this.state.showNav,
        });
    };
}
