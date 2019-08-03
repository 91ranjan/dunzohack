import styles from './listfilters.cssm';

import React from 'react';
import { Icon } from 'antd';

import TextInput from 'components/common/TextInput';
import Button from 'components/common/Button';
import SelectInput from 'components/common/SelectInput';

export default class ListFilters extends React.PureComponent {
    state = {};
    constructor(props) {
        super(props);
        this.state = {
            filters: props.filters,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.filters !== nextProps.filters) {
            this.setState({
                filters: nextProps.filters,
            });
        }
    }
    getComp = (opt, index) => {
        const { filters } = this.state;

        switch (opt.get('type')) {
            case 'text':
                return (
                    <div key={index} className={styles.filterColumn}>
                        <TextInput
                            isFullWidth={true}
                            label={opt.get('label')}
                            name={opt.get('key')}
                            value={filters.get(opt.get('key'))}
                            placeholder={opt.get('placeholder')}
                            onChange={this.onUpdate}
                        />
                    </div>
                );
                break;
        }
    };
    render() {
        const { filters, options } = this.props;
        return (
            <div className={styles.list_filters}>
                <h5>Filters</h5>
                <div>
                    {options.map((opt, index) => {
                        return this.getComp(opt, index);
                    })}
                </div>
                <Button isPrimary={true} className="pull-right" onClick={this.onSearch}>
                    <Icon type="search" />
                    Search
                </Button>
                <Button className="pull-right" onClick={this.onReset}>
                    Reset
                </Button>
                <br />
            </div>
        );
    }

    onSearch = () => {
        this.props.onUpdate(this.state.filters);
    };

    onUpdate = (name, value) => {
        const newFilters = value
            ? this.state.filters.set(name, value)
            : this.state.filters.delete(name);

        this.setState({
            filters: newFilters,
        });
    };

    onReset = () => {
        const { options } = this.props;
        let filters = this.state.filters;

        options.forEach(opt => {
            filters = filters.delete(opt.get('key'));
        });
        this.props.onUpdate(filters);
    };
}
