import "./datepickerinput.scss";

import React from "react";
import moment from "moment";
import cns from "classnames";
import { Tooltip } from "antd";

import DatePicker from "antd/lib/date-picker";

export default class DatePickerInput extends React.PureComponent {
    render() {
        const {
            label,
            value = new Date(),
            disabled = false,
            placeholder = "Select a date",
            isInline,
            format,
            tooltip,
            className,
            disabledDate = () => false
        } = this.props;

        const classes = cns(`datepicker_input ${className}`, {
            datepicker_input_fullwidth: this.props.isFullWidth,
            datepicker_input_inline: isInline
        });
        const dateHtml = (
            <label className={classes}>
                {label ? (
                    <span className="datepicker_input_label">{label}</span>
                ) : (
                    ""
                )}
                <DatePicker
                    size="large"
                    disabled={disabled}
                    disabledDate={disabledDate}
                    format={format || "DD MMM YYYY"}
                    className="datePicker"
                    value={value && moment(value).locale("en")}
                    onChange={this.onChange}
                    allowClear={false}
                    placeholder={placeholder}
                />
            </label>
        );
        return tooltip ? (
            <Tooltip placement="right" title={tooltip}>
                {dateHtml}
            </Tooltip>
        ) : (
            dateHtml
        );
    }
    onChange = (date, dateString) => {
        this.props.onChange &&
            this.props.onChange(this.props.name, date.format("YYYY-MM-DD"));
    };
}
