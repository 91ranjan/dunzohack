import "./checkboxinput.scss";

import React from "react";
import Checkbox from "antd/lib/checkbox";

export default class CheckboxInput extends React.PureComponent {
    render() {
        const { label, name, isVertical, value = false } = this.props;
        return (
            <label className="checkbox_input">
                <Checkbox onChange={this.onChange} checked={value}>
                    {label}
                </Checkbox>
            </label>
        );
    }

    onChange = e => {
        this.props.onChange &&
            this.props.onChange(this.props.name, e.target.checked);
    };
}
