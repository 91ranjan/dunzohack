import './selectcomp.scss';

import React from 'react';
import Immutable from 'immutable';
import omit from 'object.omit';
import cns from 'classnames';
import Select from 'antd/lib/select';

const { Option } = Select;

export default class SelectComp extends React.PureComponent {
    getValue = (value, placeholder) => {
        const { mode } = this.props;
        if (mode === 'tags' || mode === 'multiple') {
            if (value) {
                return value.toJS();
            } else {
                return [];
            }
        } else if (value) {
            return typeof value !== 'object' ? value + '' : value;
        }
        return '';
    };
    render() {
        const { defaultValue = '', options, value = '', placeholder, hasSearch } = this.props;
        const classes = cns('do_select_comp', this.props.className);
        const props = omit(this.props, [
            'defaultVal',
            'isFullWidth',
            'options',
            'value',
            'hasSearch',
            'onChange',
        ]);

        const optionsHtml = options.size
            ? options
                  .map(option => {
                      const value =
                          typeof option.get('value') !== 'object'
                              ? option.get('value') + ''
                              : option.get('value');
                      return (
                          <Option
                              key={option.get('value')}
                              value={value}
                              disabled={option.get('disabled') || false}
                          >
                              {option.get('name')}
                          </Option>
                      );
                  })
                  .toJS()
            : null;

        return (
            <Select
                {...props}
                autoBlur={true}
                className={classes}
                optionFilterProp="children"
                onChange={this.handleChange}
                value={this.getValue(value, placeholder)}
                filterOption={(input, option) =>
                    option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {optionsHtml}
            </Select>
        );
    }

    handleChange = value => {
        const { name, multi } = this.props;

        if (typeof value === 'object') {
            this.props.onChange(name, Immutable.fromJS(value));
        } else {
            this.props.onChange(name, value);
        }
    };
}
