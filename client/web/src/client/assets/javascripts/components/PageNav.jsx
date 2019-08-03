import './pagenav.scss';

import React from 'react';
import PropTypes from 'prop-types';
import cns from 'classnames';
import { Menu } from 'antd';
import { connect } from 'utils/connect';

import Navlink from 'components/common/Navlink';

const SubMenu = Menu.SubMenu;

const getReleasesFilter = props => {
    return {
        filters: { id: props.release_id },
    };
};
@consumeContext('acp', AcpContext.Consumer)
@consumeContext('product_id', ProductContext.Consumer)
@consumeContext('release_id', ReleaseContext.Consumer)
@connect(
    'release',
    ReleasesEntity,
    getReleasesFilter
)
export default class PageNav extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };
    render() {
        const { activeNav, showNav, acp, product_id, release_id, release } = this.props;
        const classes = cns('page_navigations', {
            hide_navigations: !showNav,
        });
        let releaseType;
        if (release.status.isSynced) {
            releaseType = release.value.get('type');
        }

        return (
            <div className={classes}>
                {/* <img src={Logo} onClick={this.props.onToggle} className="site_logo" /> */}
                <div className="nav_items">
                    <Menu
                        style={{ width: 200 }}
                        defaultSelectedKeys={[activeNav]}
                        defaultOpenKeys={['test_comps', 'test_runs']}
                        mode="inline"
                        theme="dark"
                    >
                        <Menu.Item key="dashboard">
                            <Navlink href={`product/${product_id}`}>Dashboard</Navlink>
                        </Menu.Item>
                        {!release_id &&
                        acp.hasPermission(Features.TEST, Entity.RELEASE, Operations.RETRIVE) ? (
                            <Menu.Item key="releases">
                                <Navlink href={`test/${product_id}/releases`}>
                                    Releases (Branches)
                                </Navlink>
                            </Menu.Item>
                        ) : null}
                        {releaseType === types.RELEASE || releaseType === types.BASE ? (
                            <Menu.Item key="release">Release Doc</Menu.Item>
                        ) : null}
                        {(releaseType === types.RELEASE || releaseType === types.BASE) &&
                        acp.hasPermission(Features.TEST, Entity.FEATURE, Operations.RETRIVE) ? (
                            <Menu.Item key="features">
                                <Navlink href={`test/${product_id}/release/${release_id}/features`}>
                                    Features (Epics)
                                </Navlink>
                            </Menu.Item>
                        ) : null}
                        {product_id && release_id ? (
                            <SubMenu key="test_comps" title={<span>Tests</span>}>
                                {acp.hasPermission(
                                    Features.TEST,
                                    Entity.USECASE,
                                    Operations.RETRIVE
                                ) ? (
                                    <Menu.Item key="usecases">
                                        <Navlink
                                            href={`test/${product_id}/release/${release_id}/usecases`}
                                        >
                                            Usecases (Stories)
                                        </Navlink>
                                    </Menu.Item>
                                ) : null}
                                {acp.hasPermission(
                                    Features.TEST,
                                    Entity.FLOW,
                                    Operations.RETRIVE
                                ) ? (
                                    <Menu.Item key="flows">
                                        <Navlink
                                            href={`test/${product_id}/release/${release_id}/flows`}
                                        >
                                            Flows
                                        </Navlink>
                                    </Menu.Item>
                                ) : null}
                                {acp.hasPermission(
                                    Features.TEST,
                                    Entity.STEP,
                                    Operations.RETRIVE
                                ) ? (
                                    <Menu.Item key="steps">
                                        <Navlink
                                            href={`test/${product_id}/release/${release_id}/steps`}
                                        >
                                            Steps
                                        </Navlink>
                                    </Menu.Item>
                                ) : null}
                            </SubMenu>
                        ) : null}
                        {release_id ? (
                            <Menu.Item key="commits">
                                <Navlink href={`test/${product_id}/release/${release_id}/commits`}>
                                    Commits
                                </Navlink>
                            </Menu.Item>
                        ) : null}
                        <Menu.Item key="reports">
                            <Navlink href={`test/${product_id}/reports`}>Reports</Navlink>
                        </Menu.Item>
                        <Menu.Item key="status">
                            <Navlink href={``}>Status</Navlink>
                        </Menu.Item>
                        <Menu.Item key="milestones">
                            <Navlink href={``}>Milestones</Navlink>
                        </Menu.Item>
                        <Menu.Item key="labels">
                            <Navlink href={``}>Labels</Navlink>
                        </Menu.Item>
                        <Menu.Item key="search">
                            <Navlink href={``}>Search</Navlink>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        );
    }
}
