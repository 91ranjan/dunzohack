import "./selectinput.scss";
import React from "react";
import cns from "classnames";

import { Tooltip } from "antd";

import SelectComp from "./SelectComp";

export default class SelectInput extends React.PureComponent {
    getNameByValue = () => {
        const { value, options } = this.props;
        if (value) {
            const option = options.find(opt => {
                return opt.get("value") == value;
            });
            return option ? option.get("name") : value;
        }
        return value;
    };
    render() {
        const {
            name,
            label,
            options,
            value = "",
            placeholder,
            style,
            mode = "",
            tooltip,
            readOnly
        } = this.props;
        const classes = cns("select_input", this.props.className, {
            select_input_small: this.props.isSmall,
            select_input_bottom_border: this.props.hasBorderBottom,
            select_input_fullwidth: this.props.isFullWidth,
            select_input_inline: this.props.isInline
        });
        const valueField = typeof value !== "object" ? value + "" : value;

        const comp = (
            <label className={classes}>
                {label ? <span className="select_label">{label}</span> : ""}
                {readOnly ? (
                    <span>
                        {typeof value === "object" ? (
                            value.join(", ")
                        ) : (
                            this.getNameByValue(value) + ""
                        )}
                    </span>
                ) : (
                    <SelectComp
                        mode={mode}
                        name={name}
                        placeholder={placeholder}
                        onChange={this.onChange}
                        value={valueField}
                        options={options}
                        style={style}
                    />
                )}
            </label>
        );

        return tooltip ? (
            <Tooltip placement="right" title={tooltip}>
                {comp}
            </Tooltip>
        ) : (
            comp
        );
    }

    onChange = (name, value) => {
        this.props.onChange && this.props.onChange(name, value);
    };
}
