import style from './store.cssm';

import React from 'react';
import { Button } from 'antd';
import { connect } from 'utils/connect';
import * as ProductEntity from 'entities/ProductEntity';
import Ellipsis from 'components/common/Ellipsis';
import { Table } from 'antd';
const columns = [
    {
        title: 'Product',
        dataIndex: 'product_name',
        render: text => <a href="javascript:;">{text}</a>,
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Store',
        dataIndex: 'store',
    },
];

function getStoreItem(props) {
    return {
        filters: {
            store: props.match.params.store_id,
        },
    };
}

@connect(
    'store',
    ProductEntity,
    getStoreItem
)
export default class Store extends React.PureComponent {
    componentDidMount() {
        this.props.store.actions.get(getStoreItem(this.props));
    }
    render() {
        const { store } = this.props;
        console.log(store);
        return (
            <div className={style.Page}>
                {/* <Button onClick={this.onBack}>Back</Button> */}
                {store.status.isSynced ? (
                    <Table columns={columns} dataSource={store.value.toJS()} />
                ) : (
                    <Ellipsis />
                )}
            </div>
        );
    }
    onback = () => {
        window.history.back();
    }
}
