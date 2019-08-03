import './pagination.scss';

import React from 'react';
import Button from 'components/common/Button';

export default class Pagination extends React.PureComponent {
    getPrevArrow = () => {
        const { currentPage } = this.props;
        const props = {};
        if (currentPage <= 1) {
            props.disabled = 'disabled';
        }

        return (
            <Button {...props} onClick={this.onChange.bind(this, 1)}>
                <i className="fa fa-angle-double-left" aria-hidden="true" />
            </Button>
        );
    };
    getLastArrow = () => {
        const { currentPage, totalPage } = this.props;
        const props = {};
        if (currentPage >= totalPage) {
            props.disabled = 'disabled';
        }

        return (
            <Button {...props} onClick={this.onChange.bind(this, totalPage)}>
                <i className="fa fa-angle-double-right" aria-hidden="true" />
            </Button>
        );
    };

    getPrevPages = () => {
        const { currentPage, totalPage } = this.props;
        let prevPages = [];
        for (let i = currentPage - 2 > 0 ? currentPage - 2 : 1; i < currentPage; i++) {
            prevPages.push(<Button key={i} onClick={this.onChange.bind(this, i)}>{i}</Button>);
        }
        return prevPages;
    };
    getNextPages = () => {
        const { currentPage, totalPage } = this.props;
        let prevPages = [];
        for (let i = currentPage + 1; i <= ((currentPage + 2) > totalPage ? totalPage : (currentPage + 2)); i++) {
            prevPages.push(<Button key={i} onClick={this.onChange.bind(this, i)}>{i}</Button>);
        }
        return prevPages;
    };
    getCurrentPage = () => {
        const { currentPage } = this.props;
        return <Button onClick={this.onChange.bind(this, currentPage)} isBlack={true}>{currentPage}</Button>;
    };
    render() {
        const { currentPage, totalPage } = this.props;

        return (
            <div className="table_pagination">
                {this.getPrevArrow()}
                {this.getPrevPages()}
                {this.getCurrentPage()}
                {this.getNextPages()}
                {this.getLastArrow()}
            </div>
        );
    }

    onChange = (page) => {
        this.props.onChange(page)
    }
}
