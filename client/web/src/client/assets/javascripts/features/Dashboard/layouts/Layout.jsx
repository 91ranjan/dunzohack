import styles from './layout.cssm';

import React from 'react';
import PropTypes from 'prop-types';
import qs from 'querystring';
import { Button, Icon } from 'antd';

import { connect } from 'utils/connect';

import * as SearchEntity from 'entities/SearchEntity';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import UploadReciept from '../components/UploadReciept';

const getProductFilter = props => {
    const q = qs.parse(props.location.search)['?q'];
    const type = qs.parse(props.location.search)['type'];
    return {
        filters: {
            q,
            type,
        },
    };
};

@connect(
    'search',
    SearchEntity,
    getProductFilter
)
export default class Layout extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };
    state = {};
    componentDidMount() {
        this.onSearch();
    }
    render() {
        const { location, search } = this.props;
        const value = qs.parse(location.search)['?q'];
        const type = qs.parse(location.search)['type'];
        return (
            <div className={styles.dashboard}>
                <UploadReciept>
                    <Button className="pull-right">
                        <Icon type="upload" />
                        Upload
                    </Button>
                </UploadReciept>
                <br />
                <br />
                <SearchBar
                    type={type || ''}
                    onChange={this.onChangeSearch}
                    onChangeType={this.onChangeType}
                    onSearch={this.onSearch}
                    value={value || ''}
                    isLoading={search.status.isPending}
                />
                {value ? <SearchResults type={type} value={search.value} /> : 'Search product'}
            </div>
        );
    }
    onChangeSearch = e => {
        const { history } = this.context;
        const { location } = this.props;
        const search = {
            q: e.target.value,
            type: qs.parse(location.search)['type'],
        };
        history.push('/?' + qs.stringify(search));
    };
    onChangeType = value => {
        const { location } = this.props;
        const { history } = this.context;
        const search = {
            q: qs.parse(location.search)['?q'],
            type: value,
        };
        history.push('/?' + qs.stringify(search));
    };

    onSearch = () => {
        this.props.search.actions.get(getProductFilter(this.props));
    };
}
