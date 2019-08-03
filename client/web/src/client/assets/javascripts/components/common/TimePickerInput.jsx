import './timepickerinput.scss';

import React from 'react';
import cns from 'classnames';
import moment from 'moment';
import TimePicker from 'antd/lib/time-picker';

export default class TimePickerInput extends React.PureComponent {
    render() {
        const { label, value = '01:00:00', placeholder, isInline } = this.props;
        const classes = cns('timepicker_input', {
            timepicker_input_fullwidth: this.props.isFullWidth,
            timepicker_input_inline: isInline,
        });
        return (
            <label className={classes}>
                {label ? <span className="timepicker_label">{label}</span> : ''}
                <TimePicker
                    size="large"
                    value={moment(value, 'HH:mm:ss')}
                    onChange={this.onChange}
                    hideDisabledOptions={true}
                    placeholder={placeholder}
                />
            </label>
        );
    }

    onChange = time => {
        this.props.onChange && this.props.onChange(this.props.name, time.format('HH:mm:ss'));
    };
}
