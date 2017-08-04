import React from 'react';
import PropTypes from 'prop-types';

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

	renderTimeEditor (time, updateTime) {
		const incrementHour = () => {
			const newTime = time.add(1, 'h');

			if(updateTime) {
				updateTime(newTime);
			}
		};

		const decrementHour = () => {
			const newTime = time.subtract(1, 'h');

			if(updateTime) {
				updateTime(newTime);
			}
		};

		const incrementMinute = () => {
			const newTime = time.add(5, 'm');

			if(updateTime) {
				updateTime(newTime);
			}
		};

		const decrementMinute = () => {
			const newTime = time.subtract(5, 'm');

			if(updateTime) {
				updateTime(newTime);
			}
		};

		const toggleAMPM = () => {
			const newTime = time.add(12, 'h');

			if(updateTime) {
				updateTime(newTime);
			}
		};

		let hourForDisplay = time.hour() % 12;
		if(hourForDisplay === 0) {
			hourForDisplay = 12;
		}

		const minuteForDisplay = time.minutes() >= 10 ? time.minutes() : '0' + time.minutes();
		const ampmValue = time.hour() >= 12 ? 'PM' : 'AM';

		return (<div className="course-panel-time">
			<div className="hour">
				<div className="top-control" onClick={incrementHour}><i className="icon-moveup" /></div>
				<span className="value">{hourForDisplay}</span>
				<div className="bottom-control" onClick={decrementHour}><i className="icon-movedown" /></div>
			</div>
			<div>
				<div className="colon">:</div>
			</div>
			<div className="minutes">
				<div className="top-control" onClick={incrementMinute}><i className="icon-moveup" /></div>
				<span className="value">{minuteForDisplay}</span>
				<div className="bottom-control" onClick={decrementMinute}><i className="icon-movedown" /></div>
			</div>
			<div className="am-or-pm">
				<div className="top-control" onClick={toggleAMPM}><i className="icon-moveup" /></div>
				<span className="value">{ampmValue}</span>
				<div className="bottom-control" onClick={toggleAMPM}><i className="icon-movedown" /></div>
			</div>
		</div>);
	}

	renderTimeSelection () {
		return (<div className="course-panel-time-selection">
			<div className="course-panel-starttime">
				<div className="course-panel-label">{LABELS.START_TIME}</div>
				{this.renderTimeEditor(this.props.startTime, this.props.updateStartTime)}
			</div>
			<div className="course-panel-endtime">
				<div className="course-panel-label">{LABELS.END_TIME}</div>
				{this.renderTimeEditor(this.props.endTime, this.props.updateEndTime)}
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
