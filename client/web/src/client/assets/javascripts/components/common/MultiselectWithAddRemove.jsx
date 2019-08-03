import "./multiselectwithaddremove.scss";

import React from "react";
import cns from "classnames";
import Button from "components/common/Button";

export default class MultiselectWithAddRemove extends React.PureComponent {
    state = {
        text: "",
        selectedValue: []
    };

    getMultiselectOptions = () => {
        const { value } = this.props;
        if (value !== "") {
            return value.map((val, idx) => {
                return (
                    <option value={val} key={idx}>
                        {val}
                    </option>
                );
            });
        }
        return null;
    };

    render() {
        const {
            label,
            name,
            options,
            value = "",
            placeholder,
            preIcon = null,
            type = "text",
            readOnly = false,
            tabIndex,
            disabled
        } = this.props;
        const classes = cns("multi_select_input", {
            multi_select_fullwidth: this.props.isFullWidth,
            multi_select_inline: this.props.isInline
        });

        return (
            <label className={classes}>
                {label ? (
                    <span className="multi_select_label" title={label}>
                        {label}
                    </span>
                ) : (
                    ""
                )}
                {!readOnly ? (
                    <span className="multi_select_form">
                        {options ? (
                            <select
                                onClick={this.onSelectOption}
                                onChange={this.onChangeText}
                                size="5"
                            >
                                {options.map((opt, index) => (
                                    <option
                                        key={index}
                                        value={opt.get("value")}
                                    >
                                        {opt.get("name")}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={this.state.text || ""}
                                type="text"
                                name="text_to_add"
                                onChange={this.onChangeText}
                            />
                        )}
                        <div className="selection_actions">
                            <Button isBlack={true} onClick={this.onAdd}>
                                Add
                            </Button>
                            <Button isBlack={true} onClick={this.onRemove}>
                                Remove
                            </Button>
                        </div>
                        <select
                            multiple
                            onClick={this.onSelectOption}
                            value={this.state.selectedValue}
                            onChange={this.onChangeMultiSelect}
                        >
                            {this.getMultiselectOptions()}
                        </select>
                    </span>
                ) : (
                    <span className="readOnly" title={value}>
                        {value}
                    </span>
                )}
            </label>
        );
    }

    onChangeMultiSelect = e => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            selectedValue: value
        });
    };

    onChangeText = e => {
        this.setState({
            text: e.target.value
        });
    };

    onAdd = () => {
        const { value = "" } = this.props;
        if (this.state.text !== "") {
            this.props.onChange(
                this.props.name,
                (value || []).push(this.state.text)
            );
            this.setState({
                text: ""
            });
        }
    };

    onRemove = () => {
        const { selectedValue } = this.state;
        const { value } = this.props;
        this.props.onChange(
            this.props.name,
            value.filter(val => {
                return selectedValue.indexOf(val) < 0;
            })
        );
    };

    onChange = e => {
        this.props.onChange &&
            this.props.onChange(e.target.name, e.target.value);
    };
}
