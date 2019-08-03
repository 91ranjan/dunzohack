import './textinput.scss';
import React from 'react';
import cns from 'classnames';

import Navlink from 'components/common/Navlink';

export default class TextInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value && !this.state.isEditing) {
            this.setState({
                value: nextProps.value,
            });
        }
    }
    render() {
        const {
            label,
            name,
            placeholder,
            preIcon = null,
            type = 'text',
            unit,
            readOnly = false,
            tabIndex,
            disabled,
            href,
            required,
        } = this.props;
        const { value = '' } = this.state;
        const classes = cns('text_input', {
            text_input_fullwidth: this.props.isFullWidth,
            text_input_inline: this.props.isInline,
        });
        return (
            <label className={classes}>
                {label ? (
                    <span className="text_label">
                        {label} {required ? '*' : ''}
                    </span>
                ) : (
                    ''
                )}
                {!readOnly ? (
                    <span>
                        {preIcon}
                        <input
                            onKeyUp={this.props.onKeyUp}
                            onChange={this.onChange}
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            value={value}
                            tabIndex={tabIndex}
                            disabled={disabled}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                        />
                    </span>
                ) : href ? (
                    <Navlink className="readOnly" href={href}>
                        {value}&nbsp;{unit}
                    </Navlink>
                ) : (
                    <span className="readOnly" title={value}>
                        {value}&nbsp;{unit}
                    </span>
                )}
                {unit && !readOnly ? <span className="unit">{unit}</span> : null}
            </label>
        );
    }

    onFocus = () => {
        this.setState({
            isEditing: true,
        });
    };

    onBlur = () => {
        this.setState({
            isEditing: false,
        });
        this.onCommit();
    };

    onChange = e => {
        this.setState(
            {
                value: e.target.value,
            },
            () => {
                if (this._cacheTimeout) {
                    clearTimeout(this._cacheTimeout);
                }
                this._cacheTimeout = setTimeout(() => {
                    this.onCommit();
                    this._cacheTimeout = null;
                }, 2000);
            }
        );
    };
    onCommit = () => {
        this.props.onChange && this.props.onChange(this.props.name, this.state.value);
    };
}
