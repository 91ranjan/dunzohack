import styles from './addentity.cssm';
import React from 'react';
import cns from 'classnames';

export default class AddEntity extends React.PureComponent {
    render() {
        const { className } = this.props;
        return (
            <button className={cns(styles.button, className)} onClick={this.onClick}>
                <span>+</span>
            </button>
        );
    }

    onClick = () => {
        this.props.onClick && this.props.onClick();
    };
}
