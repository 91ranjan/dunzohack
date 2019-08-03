import styles from './layout.cssm';

import React from 'react';
import PropTypes from 'prop-types';
import qs from 'querystring';

import { connect } from 'utils/connect';

import * as SearchEntity from 'entities/SearchEntity';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

const getCommitFilter = props => {
    const q = qs.parse(props.location.search)['?q'];
    return {
        filters: {
            q,
        },
    };
};

@connect(
    'search',
    SearchEntity,
    getCommitFilter
)
export default class Layout extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };
    state = {};
    render() {
        const { location } = this.props;
        const value = qs.parse(location.search)['?q'];
        console.log(value);
        return (
            <div className={styles.dashboard}>
                <SearchBar
                    onChange={this.onChangeSearch}
                    onSearch={this.onSearch}
                    value={value || ''}
                />
                <SearchResults />
            </div>
        );
    }
    onChangeSearch = e => {
        const { history } = this.context;
        history.push('/?' + qs.stringify({ q: e.target.value }));
    };
}
