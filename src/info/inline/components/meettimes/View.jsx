import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import { getWeekdaysFrom, convertToTimeStr } from './utils';
import Disclaimer from './Disclaimer';


const t = scoped('course.info.inline.components.meettimes.View', {
	label: 'Meet Times'
});

export default class MeetTimesView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool
	}

	static FIELD_NAME = 'Schedule';

	static hasData (catalogEntry) {
		const schedule = catalogEntry[MeetTimesView.FIELD_NAME];

		return schedule && schedule.days && schedule.days.length !== 0 && schedule.days[0] !== '';
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderDate (date) {
		if(date) {
			return (
				<div>
					{date}
				</div>
			);
		}

		return null;
	}

	renderDayRow = (day, startTime, endTime) => {
		return (
			<div key={day} className="day-row">
				<div className="day">{day}</div>
				<div className="times">
					{this.renderDate(startTime)}
					<div className="time-separator">-</div>
					{this.renderDate(endTime)}
				</div>
			</div>
		);

	}

	renderTimes () {
		const { Schedule } = this.props.catalogEntry;

		if(Schedule) {
			const selectedWeekdays = getWeekdaysFrom(this.props.catalogEntry);
			const startTime = Schedule.times && convertToTimeStr(Schedule.times[0]);
			const endTime = Schedule.times && convertToTimeStr(Schedule.times[1]);

			return (
				<div>
					{selectedWeekdays.map((day) => this.renderDayRow(day, startTime, endTime))}
				</div>
			);
		}

		return (<div>-</div>);
	}

	render () {
		const {editable} = this.props;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
					{editable && (<Disclaimer />)}
				</div>
				<div className="content-column">{this.renderTimes()}</div>
			</div>
		);
	}
}
