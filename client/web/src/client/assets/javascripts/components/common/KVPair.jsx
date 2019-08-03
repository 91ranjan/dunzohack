import styles from './kvpair.cssm';

import React from 'react';
import { List, Map } from 'immutable';

import TextInput from 'components/common/TextInput';

class KVItem extends React.PureComponent {
    render() {
        const { item, keyLabel, valueLabel } = this.props;
        return (
            <div className={styles.KVPair}>
                <div>
                    <TextInput
                        label={keyLabel}
                        name="key"
                        value={item.get('key')}
                        placeholder="Key"
                        onChange={this.onChange}
                    />
                </div>
                <div>
                    <TextInput
                        label={valueLabel}
                        name="value"
                        value={item.get('value')}
                        placeholder="Value"
                        onChange={this.onChange}
                    />
                </div>
                <span onClick={this.onDelete}>X</span>
            </div>
        );
    }
    onChange = (name, val) => {
        const { item, index } = this.props;
        this.props.onUpdate(index, item.set(name, val));
    };
    onDelete = () => {
        this.props.onDelete(this.props.index);
    };
}

export default class KVPair extends React.PureComponent {
    render() {
        const { value = List(), keyLabel = 'Key', valueLabel = 'Value' } = this.props;

        return (
            <div>
                <button onClick={this.onAdd}>+ Add</button>
                {value.map((row, index) => {
                    return (
                        <KVItem
                            index={index}
                            key={index}
                            item={row}
                            keyLabel={keyLabel}
                            valueLabel={valueLabel}
                            onUpdate={this.onUpdate}
                            onDelete={this.onDelete}
                        />
                    );
                })}
            </div>
        );
    }

    onAdd = () => {
        const { value = List() } = this.props;
        this.props.onUpdate(
            value.set(
                value.size,
                Map({
                    key: '',
                    value: '',
                })
            )
        );
    };

    onUpdate = (index, val) => {
        this.props.onUpdate(this.props.value.set(index, val));
    };

    onDelete = index => {
        this.props.onUpdate(this.props.value.delete(index));
    };
}
