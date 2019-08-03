import './verticalformrow.scss';
import React from 'react';

export default class VerticalFormRow extends React.PureComponent {
    render() {
        const {label, unit} = this.props;
        return <div className="verticalFormRow">
                <div className="ant-form-item-label">
                    <label>{label}</label>
                </div>
                <div className="value">
                    <span>{this.props.children}</span>
                    {unit ?
                        <span className="unit">{unit}</span> :
                        null
                    }
                </div>
            </div>
    }
}