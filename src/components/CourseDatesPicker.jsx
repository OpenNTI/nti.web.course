import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { DayPicker } from 'nti-web-commons';

export default class CourseDatesPicker extends React.Component {
	static propTypes = {
		startDate: PropTypes.object,
		endDate: PropTypes.object,
		updateStartDate: PropTypes.func,
		updateEndDate: PropTypes.func
	}

	constructor (props) {
		super(props);
		this.state = {selectedType: 'Start'};
	}

	renderDate (type, date) {
		const onSelect = () => {
			this.setState({selectedType: type});
		};

		let className = 'date';

		if(this.state.selectedType === type) {
			className += ' selected';
		}

		return (<div className={className} onClick={onSelect}>
			<div className="label">{type}</div>
			<div className="value">{date.format('MMM')}. {date.date()}</div>
		</div>);
	}

	getValue () {
		if(this.state.selectedType === 'Start') {
			return this.props.startDate.toDate();
		}
		else {
			return this.props.endDate.toDate();
		}
	}

	render () {
		const onChange = (date) => {
			if(this.state.selectedType === 'Start' && this.props.updateStartDate) {
				this.props.updateStartDate(moment(date));
			}
			else if(this.state.selectedType === 'End' && this.props.updateEndDate) {
				this.props.updateEndDate(moment(date));
			}
		};

		return (<div className="course-panel-choosedates">
			<div className="selected-dates">
				{this.renderDate('Start', this.props.startDate)}
				{this.renderDate('End', this.props.endDate)}
			</div>
			<DayPicker value={this.getValue()} onChange={onChange}/>
		</div>
		);
	}
}
