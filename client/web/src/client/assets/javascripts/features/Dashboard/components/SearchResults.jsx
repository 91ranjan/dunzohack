import React from 'react';
import { Table } from 'antd';
const StoreColumns = [
    {
        title: 'Id',
        dataIndex: '_id',
        render: id => <a href={`/store/${id}`}>{id}</a>,
    },
    {
        title: 'Store',
        dataIndex: 'store_name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Categories',
        dataIndex: 'categories',
        render: cats => cats.join(', '),
    },
];
const ProductColumns = [
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

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

export default class SearchResults extends React.PureComponent {
    render() {
        const { value, type } = this.props;
        return value ? (
            <Table
                rowSelection={rowSelection}
                columns={type === 'store_name' ? StoreColumns : ProductColumns}
                dataSource={value.toJS()}
            />
        ) : null;
        /*return (
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Store</th>
                        <th>Categories</th>
                        <th>GSTIN</th>
                        <th>Mobile</th>
                        <th>Packing charge</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tomato ketchep</td>
                        <td>Noble super bazzar</td>
                        <td>Groccery, supermarket</td>
                        <td>12345566675</td>
                        <td>1234567890</td>
                        <td>10%</td>
                    </tr>
                </tbody>
            </table>
        );*/
    }
}
