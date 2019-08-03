import './radioinput.scss';

import React from 'react';
import cns from 'classnames';
import Radio from 'antd/lib/radio';

const RadioGroup = Radio.Group;

export default class RadioInput extends React.PureComponent {
    render () {
        const { label, options, isVertical, value, disabled = false } = this.props;
        const classes = cns ('radio_input', this.props.className, {
            'radio_input_vertical' : this.props.isVertical
        })
        
        return (
            <label className={classes}>
                {label ? <span>{label} <br/></span> : null}
                <RadioGroup onChange={this.onChange} value={value} disabled={disabled}>
                    {options && options.map((option) => {
                        return <Radio key={option.value} value={option.value}>{option.label}</Radio>
                    })}
                </RadioGroup>
            </label>);
    }

    onChange = (e) => {
        this.props.onChange && this.props.onChange(this.props.name, e.target.value);
    }
}