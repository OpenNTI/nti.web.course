import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from 'nti-web-commons';

const LABELS = {
	WHICH_DAYS: 'What days do you meet?',
	START_TIME: 'Start Time',
	END_TIME: 'End Time'
};

export default class DayTime extends React.Component {
	static propTypes = {
		selectedWeekdays: PropTypes.arrayOf(PropTypes.string),
		weekdayClicked: PropTypes.func,
		startTime: PropTypes.object,
		updateStartTime: PropTypes.func,
		endTime: PropTypes.object,
		updateEndTime: PropTypes.func
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	renderWeekdays () {
		const days = [{name: 'sunday', code: 'S'},
			{name: 'monday', code: 'M'},
			{name: 'tuesday', code: 'T'},
			{name: 'wednesday', code: 'W'},
			{name: 'thursday', code: 'T'},
			{name: 'friday', code: 'F'},
			{name: 'saturday', code: 'S'}];

		const renderDay = (day) => {
			const onClick = () => {
				if(this.props.weekdayClicked) {
					this.props.weekdayClicked(day.name);
				}
			};

			let className = 'course-panel-day';
			if(this.props.selectedWeekdays && this.props.selectedWeekdays.includes(day.name)) {
				className += ' selected';
			}

			return (<div className={className} onClick={onClick}>{day.code}</div>);
		};

		return (<div className="course-panel-weekdays">
			{days.map(renderDay)}
		</div>);
	}

	renderDaySelection () {
		return (<div className="course-panel-day-selection">
			<div className="course-panel-label">{LABELS.WHICH_DAYS}</div>
			{this.renderWeekdays()}
		</div>);
	}

	renderTimeSelection () {
		const updateStartTime = (newDate) => {
			if(this.props.updateStartTime) {
				this.props.updateStartTime(newDate);
			}
		};

		const updateEndTime = (newDate) => {
			if(this.props.updateEndTime) {
				this.props.updateEndTime(newDate);
			}
		};

		return (<div className="course-panel-time-selection">
			<div className="course-panel-starttime">
				<div className="course-panel-label">{LABELS.START_TIME}</div>
				<TimePicker value={this.props.startTime} onChange={updateStartTime}/>
			</div>
			<div className="course-panel-endtime">
				<div className="course-panel-label">{LABELS.END_TIME}</div>
				<TimePicker value={this.props.endTime} onChange={updateEndTime}/>
			</div>
		</div>);
	}

	render () {
		return (<div>
			{this.renderDaySelection()}
			{this.renderTimeSelection()}
		</div>
		);
	}
}
