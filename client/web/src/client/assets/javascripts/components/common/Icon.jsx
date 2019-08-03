import "./icon.scss";

import React from "react";
import cns from "classnames";

export default class Icon extends React.PureComponent {
    render() {
        const { className, icon } = this.props;
        const classes = cns("do-icon", className);
        return (
            <i
                className={classes}
                dangerouslySetInnerHTML={{ __html: icon }}
                onClick={this.props.onClick}
            />
        );
    }
}
