import React from 'react';
import moment from 'utils/moment';

export default class TimeSince extends React.PureComponent {
	state = {
		time: null,
		timeSince: null,
	}
	componentDidMount() {
		this.setState({
			'time': this.props.time,
			timeSince: this.getTimeSince(this.props.time)
		});
		this._interval = setInterval(()=>{
			this.setState({'timeSince': this.getTimeSince(this.state.time)});
		}, 60000);
	}

	componentWillUnmount() {
		clearInterval(this._interval);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.time !== this.state.time) {
			this.setState({'time': nextProps.time});
		}
	}
	getTimeSince = (time) => {
		return moment(time.diff(moment())).format("h [hours] m [mins]")
	}
	render() {
		return <span>{this.state.timeSince}</span>;
	}
}