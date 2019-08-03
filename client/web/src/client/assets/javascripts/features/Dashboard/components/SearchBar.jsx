import styles from './searchbar.cssm';

import React from 'react';
import { Input, Select, Button } from 'antd';
const { Option } = Select;

export default class SearchBar extends React.PureComponent {
    selectBefore = (
        <Select defaultValue="product_name" style={{ width: 90 }}>
            <Option value="product_name">Product</Option>
            <Option value="store_name">Store</Option>
        </Select>
    );
    render() {
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        value={this.props.value}
                        addonBefore="Product"
                        onChange={this.props.onChange}
                        className={styles.Search}
                    />
                    <Button
                        type="primary"
                        loading={this.props.isLoading}
                        onClick={this.props.onSearch}
                    >
                        Search
                    </Button>
                </div>
            </div>
        );
    }
}
