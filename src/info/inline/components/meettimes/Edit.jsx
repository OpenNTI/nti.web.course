import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {TimePicker} from 'nti-web-commons';

import Day from '../../../../editor/panels/daytime/Day';

import { getWeekdaysFrom, getDateStr } from './utils';


const t = scoped('course.info.inline.components.meettimes.Edit', {
	label: 'Meet Times',
	description: 'When to be online together (local time).'
});

export default class MeetTimesEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'Schedule';

	constructor (props) {
		super(props);

		this.state = {
			startTime: getDateStr(this.props.catalogEntry && this.props.catalogEntry.Schedule && this.props.catalogEntry.Schedule.times[0]),
			endTime: getDateStr(this.props.catalogEntry && this.props.catalogEntry.Schedule && this.props.catalogEntry.Schedule.times[1]),
			selectedWeekdays: getWeekdaysFrom(this.props.catalogEntry),
		};
	}

	buildSaveableValue () {
		// gather up the currently selected days/times
		let times = [];

		const pad = (value) => {
			if(value < 10) {
				return '0' + value;
			}

			return value;
		};

		if(this.state.startTime) {
			times.push(pad(this.state.startTime.getHours()) + ':' + pad(this.state.startTime.getMinutes()) + ':00-05:00');
		}
		if(this.state.endTime) {
			times.push(pad(this.state.endTime.getHours()) + ':' + pad(this.state.endTime.getMinutes()) + ':00-05:00');
		}

		const schedule = {
			days: this.state.selectedWeekdays.map((d) => {
				if(d === 'thursday') {
					return 'R';
				}

				if(d === 'sunday') {
					return 'N';
				}

				return d.toUpperCase().charAt(0);
			}),
			times: times
		};

		this.props.onValueChange && this.props.onValueChange(MeetTimesEdit.FIELD_NAME, schedule);
	}

	onDayClick = (day) => {
		let selectedWeekdays = this.state.selectedWeekdays ? [...this.state.selectedWeekdays] : [];

		if(selectedWeekdays.includes(day.name)) {
			selectedWeekdays.splice(selectedWeekdays.indexOf(day.name), 1);
		}
		else {
			selectedWeekdays.push(day.name);
		}

		this.setState({selectedWeekdays : selectedWeekdays}, this.buildSaveableValue);
	}

	renderDay = (day, index) => {
		return (
			<Day key={day.name}
				day={day}
				className="course-editor-day"
				onClick={this.onDayClick}
				selected={this.state.selectedWeekdays && this.state.selectedWeekdays.includes(day.name)}
			/>
		);
	};

	renderWeekdays () {
		const days = [{name: 'sunday', code: 'S'},
			{name: 'monday', code: 'M'},
			{name: 'tuesday', code: 'T'},
			{name: 'wednesday', code: 'W'},
			{name: 'thursday', code: 'T'},
			{name: 'friday', code: 'F'},
			{name: 'saturday', code: 'S'}];

		return (<div className="course-editor-weekdays">
			{days.map(this.renderDay)}
		</div>);
	}

	renderDaySelection () {
		return (<div className="course-editor-day-selection">
			{this.renderWeekdays()}
		</div>);
	}

	updateStartTime = (newDate) => {
		this.setState({ startTime: newDate }, this.buildSaveableValue);
	};

	updateEndTime = (newDate) => {
		this.setState({ endTime: newDate }, this.buildSaveableValue);
	};

	renderTimeSelection () {
		return (<div className="course-editor-time-selection">
			<div className="course-editor-starttime">
				<TimePicker value={this.state.startTime} onChange={this.updateStartTime}/>
			</div>
			<div className="spacer">-</div>
			<div className="course-editor-endtime">
				<TimePicker value={this.state.endTime} onChange={this.updateEndTime}/>
			</div>
		</div>);
	}

	render () {
		return (
			<div className="field-info">
				<div className="field-label">{t('label')}</div>
				<div className="field-description">{t('description')}</div>
				<div className="meet-times-edit-widget">
					{this.renderDaySelection()}
					{this.renderTimeSelection()}
				</div>
			</div>
		);
	}
}
