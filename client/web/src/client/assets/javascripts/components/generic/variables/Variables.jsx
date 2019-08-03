import styles from './variables.cssm';
import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { Map } from 'immutable';
import uuid from 'uuid/v1';
import Button from 'components/common/Button';

import VariableForm from './VariableForm';

export default class Variables extends React.PureComponent {
    state = {
        activeTab: null,
    };
    constructor(props) {
        super(props);
    }
    render() {
        const { variables } = this.props;
        return (
            <div className={styles.SidePanel}>
                <div className={styles.PanelHeader}>Variables</div>
                <div className={styles.PanelBody}>
                    <Button isPrimary onClick={this.onAddVar}>
                        <Icon type="plus" />
                        Add
                    </Button>
                    {variables.map((variable, index) => {
                        return (
                            <span className={styles.globalVariable} key={index}>
                                <VariableForm
                                    variable={variable}
                                    canBeGlobal={this.props.canBeGlobal && true}
                                    onUpdate={this.onUpdateVar.bind(this, index)}
                                />
                                <Popconfirm
                                    title="Are you sure delete this variable?"
                                    onConfirm={this.onDeleteVar.bind(this, index)}
                                    onCancel={() => {}}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button isPrimary>
                                        <Icon type="delete" />
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }

    onAddVar = () => {
        this.onUpdateVar(
            this.props.variables.size,
            Map({
                id: uuid(true),
            })
        );
    };

    onDeleteVar = index => {
        this.props.onDelete(
            this.props.variables.getIn([index, 'id']),
            this.props.variables.delete(index)
        );
    };

    onUpdateVar = (index, variable) => {
        this.props.onUpdate(this.props.variables.set(index, variable));
    };
}
