import React from 'react';
import Immutable from 'immutable';

import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';

export default class DropDown extends React.PureComponent {
    getMenu = () => {
        return (
            <Menu>
                {this.props.options.map((option, index) => {
                    let label = option.get('name');
                    label = Immutable.Map.isMap(label) || Immutable.List.isList(label) ? label.toJS() : label;
                    return (
                        <Menu.Item key={index}>
                            <a onClick={this.onClick.bind(this, option.get('value'))}>{label}</a>
                        </Menu.Item>
                    );
                }).toJS()}
            </Menu>
        )
    }
    getLabelForValue = () => {
        const selectedOption =  this.props.options.find((option) => {
            return option.get('value') === this.props.value + '';
        });
        if (selectedOption) {
            const label = selectedOption.get('name');
            return Immutable.Map.isMap(label) || Immutable.List.isList(label) ? label.toJS() : label;
        }
        return this.props.value;
    }
    render () {
        return (
            <Dropdown overlay={this.getMenu()} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                    {this.getLabelForValue()}<Icon type="down" />
                </a>
            </Dropdown>
        );
    }

    onClick = (value) => {
        this.props.onChange(this.props.name, value);
    }
}