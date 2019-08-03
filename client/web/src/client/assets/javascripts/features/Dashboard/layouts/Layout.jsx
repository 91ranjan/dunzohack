import styles from "./layout.cssm";

import React from "react";

export default class Layout extends React.PureComponent {
    render() {
        return (
            <div className={styles.dashboard_default_layout}>
                Dashboard
            </div>
        );
    }
}
