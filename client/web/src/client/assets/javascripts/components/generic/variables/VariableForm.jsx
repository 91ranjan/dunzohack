import React from 'react';
import { fromJS } from 'immutable';

import TextInput from 'components/common/TextInput';
import TextAreaInput from 'components/common/TextAreaInput';
import SelectInput from 'components/common/SelectInput';
import CheckboxInput from 'components/common/CheckboxInput';
import Button from 'components/common/Button';

const variableTypes = fromJS([
    {
        name: 'String',
        value: 'string',
    },
    {
        name: 'Number',
        value: 'number',
    },
    {
        name: 'Script',
        value: 'script',
    },
]);

export default class VariableForm extends React.PureComponent {
    render() {
        const { variable, isInputVar, canBeGlobal = false } = this.props;
        return (
            <div>
                {!isInputVar ? (
                    <TextInput
                        isInline
                        isFullWidth
                        label="Name"
                        name="name"
                        value={variable.get('name')}
                        placeholder="Name"
                        onChange={this.onChange}
                    />
                ) : null}
                <SelectInput
                    isInline
                    isFullWidth
                    label="Type"
                    name="type"
                    value={variable.get('type')}
                    options={variableTypes}
                    onChange={this.onChange}
                />
                <TextAreaInput
                    isInline
                    isFullWidth
                    label="Value"
                    name="value"
                    value={variable.get('value')}
                    placeholder="Ex. test_name_**uuid_5**"
                    onChange={this.onChange}
                />
                {isInputVar || variable.get('type') === 'script' ? (
                    <TextInput
                        isInline
                        isFullWidth
                        label="Output Var"
                        name="output_var"
                        value={variable.get('output_var')}
                        placeholder="Ex. AppName"
                        onChange={this.onChange}
                    />
                ) : null}
                {canBeGlobal ? (
                    <CheckboxInput
                        label="Expose Globally"
                        name="isGlobal"
                        onChange={this.onChange}
                        value={variable.get('isGlobal')}
                    />
                ) : null}
            </div>
        );
    }

    onChange = (name, value) => {
        const { variable } = this.props;
        this.props.onUpdate(variable.set(name, value));
    };
}
