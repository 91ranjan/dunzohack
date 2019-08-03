import styles from './selectproduct.cssm';

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

import { connect } from 'utils/connect';
import Navlink from 'components/common/Navlink';
import consumeContext from 'utils/consumeContext';
import { ReleaseContext } from 'context/releaseContext';
import { ProductContext } from 'context/productContext';

import * as ReleasesEntity from 'entities/ReleasesEntity';

const getReleasesFilter = props => {
    const filters = { product: props.product_id };
    return {
        filters,
    };
};

@consumeContext('product_id', ProductContext.Consumer)
@consumeContext('release_id', ReleaseContext.Consumer)
@connect(
    'releases',
    ReleasesEntity,
    getReleasesFilter
)
export default class SelectRelease extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    componentDidMount() {
        if (this.props.product_id) {
            this.props.releases.actions.get(getReleasesFilter(this.props));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.product_id !== nextProps.product_id) {
            this.props.releases.actions.get(getReleasesFilter(nextProps));
        }
    }

    getReleaseName = () => {
        const { releases, release_id } = this.props;
        let selectedRelease = releases.value.find(release => {
            return release.get('id') === release_id;
        });
        return selectedRelease ? selectedRelease.get('name') : 'Select Release (branch)';
    };

    getReleaseMenu = () => {
        const { releases, product_id } = this.props;
        let items = [];
        if (releases.value) {
            releases.value.forEach(release => {
                items.push(
                    <Menu.Item key={release.get('id')}>
                        <Navlink
                            className={styles.productLink}
                            href={`product/${product_id}/release/${release.get('id')}`}
                        >
                            <label className={styles.productOption}>{release.get('name')}</label>
                            <span className={styles.productDescription}>
                                {release.get('description')}
                            </span>
                        </Navlink>
                    </Menu.Item>
                );
            });
        }
        return <Menu>{items}</Menu>;
    };

    render() {
        const { product_id, release_id } = this.props;
        const releaseName = this.getReleaseName();
        return (
            <div className={styles.product}>
                {release_id ? (
                    <Navlink
                        href={`product/${product_id}/release/${release_id}`}
                        className={styles.productName}
                    >
                        {releaseName}
                    </Navlink>
                ) : (
                    <span className={styles.productName}>{releaseName}</span>
                )}
                <Dropdown
                    overlay={this.getReleaseMenu()}
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
