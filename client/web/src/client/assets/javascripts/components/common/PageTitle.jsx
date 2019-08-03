import './pagetitle.scss';

import React from 'react';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
import Icon from 'antd/lib/icon';

import LocaleProvider from 'antd/lib/locale-provider';

moment.locale('en');

export default class PageTitle extends React.PureComponent {
    render() {
        const { title, hasDateSelector, selectedDate = (new Date()) } = this.props;
        return (<div className="pageTitle">
                <h3>{title}</h3>
                {this.props.children}
                {hasDateSelector ?
                    <div className="page_date_selector">
                        <span>Select Date</span>
                        <div>
                            <Icon type="left" onClick={this.onPreviousDate} />
                            <Icon type="right" onClick={this.onNextDate}/>
                            <DatePicker size="large"
                                format="DD MMM YYYY"
                                className="datePicker"
                                value={moment(selectedDate).locale('en')}
                                onChange={this.onChange}
                                allowClear={false}
                            />
                        </div>
                    </div>:
                    null
                }
            </div>
        );
    }

    onPreviousDate = () => {
        const prevDay = moment(this.props.selectedDate).add(-1, 'days');
        this.onChange(prevDay)
    }

    onNextDate = () => {
        const nextDay = moment(this.props.selectedDate).add(1, 'days');
        this.onChange(nextDay)
    }

    onChange = (date, dateString) => {
        this.props.onChange(date);
    }
}