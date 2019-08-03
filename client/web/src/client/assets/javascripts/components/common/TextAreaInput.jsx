import "./textareainput.scss";

import React from "react";
import Input from "./Input";
import cns from "classnames";

import { Tooltip } from "antd";

export default class TextAreaInput extends React.PureComponent {
    render() {
        const {
            label,
            name,
            value = "",
            placeholder,
            preIcon = null,
            type = "text",
            unit,
            readOnly = false,
            tabIndex,
            disabled,
            tooltip
        } = this.props;
        const classes = cns("text_area_input", {
            text_input_fullwidth: this.props.isFullWidth,
            text_input_inline: this.props.isInline
        });
        return (
            <label className={classes}>
                {label ? (
                    <span className="text_label" title={label}>
                        {label}
                    </span>
                ) : (
                    ""
                )}
                {!readOnly ? (
                    <span>
                        {preIcon}
                        {tooltip ? (
                            <Tooltip placement="right" title={tooltip}>
                                <textarea
                                    onChange={this.onChange}
                                    name={name}
                                    type={type}
                                    placeholder={placeholder}
                                    value={value}
                                    tabIndex={tabIndex}
                                    disabled={disabled}
                                />
                            </Tooltip>
                        ) : (
                            <textarea
                                onChange={this.onChange}
                                name={name}
                                type={type}
                                placeholder={placeholder}
                                value={value}
                                tabIndex={tabIndex}
                                disabled={disabled}
                            />
                        )}
                    </span>
                ) : (
                    <span className="readOnly" title={value}>
                        {value}&nbsp;{unit}
                    </span>
                )}
                {unit && !readOnly ? (
                    <span className="unit">{unit}</span>
                ) : null}
            </label>
        );
    }

    onChange = e => {
        this.props.onChange &&
            this.props.onChange(e.target.name, e.target.value);
    };
}
