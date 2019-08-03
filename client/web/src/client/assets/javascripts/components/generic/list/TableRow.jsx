import './tablerow.scss';

import React from 'react';

export default class TableRow extends React.PureComponent {
    render() {
        const { row, columns, rowProps } = this.props;
        return (
            <tr className="table_row" onClick={this.onClick}>
                {columns.map((col, index) => (
                    <td key={index}>{col.get('accessor')(row, rowProps)}</td>
                ))}
            </tr>
        );
    }

    onClick = () => {
        this.props.onSelectRow && this.props.onSelectRow(this.props.row);
    };
}
