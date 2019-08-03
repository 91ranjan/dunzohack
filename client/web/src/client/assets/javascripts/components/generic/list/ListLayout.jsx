import './listlayout.scss';

import React from 'react';

import ListTable from './ListTable';
import ListPagination from './ListPagination';

export default class ListLayout extends React.PureComponent {
    render() {
        const { total, filters } = this.props;
        return (
            <div className="list_layout">
                <ListTable {...this.props} />
                <br />
                {total ? (
                    <ListPagination
                        total={total}
                        limit={filters.get('limit')}
                        page={filters.get('page')}
                        onChange={this.onChangePage}
                    />
                ) : null}
                <br />
                <br />
            </div>
        );
    }

    onChangePage = page => {
        const { filters } = this.props;
        this.props.onUpdateFilters(filters.set('page', page));
    };
}
