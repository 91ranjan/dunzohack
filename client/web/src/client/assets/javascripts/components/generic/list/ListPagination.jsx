import React from "react";
import cns from "classnames";
import { Pagination } from "antd";

export default class ListPagination extends React.PureComponent {
    render() {
        const { total, limit, page } = this.props;

        return (
            <div className="pull-right">
                <Pagination
                    showQuickJumper
                    defaultCurrent={1}
                    current={page}
                    total={total}
                    pageSize={limit}
                    onChange={this.onChange}
                />
            </div>
        );
    }

    onChange = (page, pageSize) => {
        this.props.onChange(page);
    };
}
