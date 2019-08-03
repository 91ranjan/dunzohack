import styles from './tabs.cssm';

import React from 'react';
import cns from 'classnames';
import { List } from 'immutable';

export default class Tabs extends React.PureComponent {
    render() {
        const { sections = List(), activeKey, classNames } = this.props;
        return (
            <ul className={styles.tabs}>
                {sections.map((tab, index) => {
                    const classes = cns(styles.tab, classNames, {
                        [styles.active]: activeKey === tab.get('key'),
                    });
                    return (
                        <li className={classes} key={index} onClick={this.onChange.bind(this, tab)}>
                            {tab.get('svg') ? (
                                <span className={styles.icon} dangerouslySetInnerHTML={{ __html: tab.get('svg') }} />
                            ) : null}
                            {tab.get('label') || tab.comp}
                        </li>
                    );
                })}
            </ul>
        );
    }
    onChange = tab => {
        this.props.onChange && this.props.onChange(tab);
    };
}
