import './listtable.scss';

import React from 'react';
import Immutable from 'immutable';

import TableRow from './TableRow';

export default class ListTable extends React.PureComponent {
    render() {
        const {
            columns = Immutable.List(),
            data = Immutable.List(),
            onSelectRow,
            rowProps = Immutable.Map(),
        } = this.props;
        return (
            <table className="list_table">
                <thead>
                    <tr>
                        {columns.map((col, index) => {
                            return <th key={index}> {col.get('name')} </th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.size ? (
                        data.map((row, index) => {
                            return (
                                <TableRow
                                    onSelectRow={onSelectRow}
                                    key={index + 1}
                                    columns={columns}
                                    row={row}
                                    rowProps={rowProps}
                                />
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.size}>
                                <center>No Records found</center>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}
