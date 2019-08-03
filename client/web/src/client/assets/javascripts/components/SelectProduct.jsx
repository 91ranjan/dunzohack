import styles from './selectproduct.cssm';

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

import Navlink from 'components/common/Navlink';
import consumeContext from 'utils/consumeContext';
import { AcpContext } from 'context/acpContext';
import { ProductContext } from 'context/productContext';
import { ReleaseContext } from 'context/releaseContext';

@consumeContext('product_id', ProductContext.Consumer)
@consumeContext('release_id', ReleaseContext.Consumer)
@consumeContext('acp', AcpContext.Consumer)
export default class SelectProduct extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    getProductsName = () => {
        const { product_id, acp } = this.props;
        let productAcp = acp.user_acps.find(acp => {
            return acp.getIn(['role_acp', 'product', 'id']) === product_id;
        });
        return productAcp ? productAcp.getIn(['role_acp', 'product', 'name']) : 'Select Product';
    };

    getProductMenu = () => {
        const { acp } = this.props;
        let items = [];
        acp.user_acps.forEach(acp => {
            const product = acp.getIn(['role_acp', 'product']);
            items.push(
                <Menu.Item key={product.get('id')}>
                    <Navlink className={styles.productLink} href={`product/${product.get('id')}`}>
                        <label className={styles.productOption}>{product.get('name')}</label>
                        <span className={styles.productDescription}>
                            {product.get('description')}
                        </span>
                    </Navlink>
                </Menu.Item>
            );
        });
        return <Menu>{items}</Menu>;
    };

    render() {
        const { product_id } = this.props;
        const productName = this.getProductsName();
        return (
            <div className={styles.product}>
                {productName ? (
                    <Navlink href={`product/${product_id}`} className={styles.productName}>
                        {productName}
                    </Navlink>
                ) : (
                    <span className={styles.productName}>{productName}</span>
                )}
                <Dropdown
                    overlay={this.getProductMenu()}
                    overlayClassName={styles.productMenu}
                    placement="bottomRight"
                >
                    <Icon className={styles.menuTrigger} type="down" />
                </Dropdown>
            </div>
        );
    }
    onUpdate = (name, value) => {
        this.context.history.push(`test/${value}/releases`);
    };
}
