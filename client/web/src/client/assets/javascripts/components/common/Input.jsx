import './input.scss';

import React from 'react';
import omit from 'object.omit';
import cns from 'classnames';
import InputAntd from 'antd/lib/input';

export default class Input extends React.PureComponent {
	render() {
		const props = omit(this.props, ['onChange', 'suggestion', 'className', 'hasBorder', 'bottomBorder']);
		const classes = cns(this.props.className, {
			'input_comp': true,
			'input_borderless': !this.props.hasBorder,
			'input_bottom_border': this.props.bottomBorder
		});

		return <span>
			<InputAntd {...props}
				className={classes}
				onChange={this.onChange} />
			{this.props.suggestion ?
				<span className="form-suggestion">
	                {this.props.suggestion}
	            </span> :
	            null
			}
		</span>
	}

	onChange = (e) => {
		this.props.onChange(e['target'].name, e['target'].value);
	}
}