import './WizardPanel.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { TimePicker } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { saveCatalogEntry } from '../../../editor/Actions';

import Day from './Day';

const t = scoped('course.editor.panels.daytime.WizardPanel', {
	cancel: 'Cancel',
	whichDays: 'What days do you meet?',
	startTime: 'Start Time',
	endTime: 'End Time',
});

export default class DayTimeWizardPanel extends React.Component {
	static tabName = 'DayTime';
	static tabDescription = 'Day & Time';

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string,
	};

	constructor(props) {
		super(props);

		const getWeekdaysFrom = entry => {
			if (entry && entry.Schedule) {
				const days = entry.Schedule.days && entry.Schedule.days[0];

				let selectedWeekdays = [];

				if (days.indexOf('M') >= 0) {
					selectedWeekdays.push('monday');
				}
				if (days.indexOf('T') >= 0) {
					selectedWeekdays.push('tuesday');
				}
				if (days.indexOf('W') >= 0) {
					selectedWeekdays.push('wednesday');
				}
				if (days.indexOf('R') >= 0) {
					selectedWeekdays.push('thursday');
				}
				if (days.indexOf('F') >= 0) {
					selectedWeekdays.push('friday');
				}
				if (days.indexOf('S') >= 0) {
					selectedWeekdays.push('saturday');
				}
				if (days.indexOf('N') >= 0) {
					selectedWeekdays.push('sunday');
				}

				return selectedWeekdays;
			}

			return [];
		};

		const getDateStr = dateStr => {
			if (!dateStr) {
				let d = new Date();
				d.setHours(9);
				d.setMinutes(0);

				return d;
			}

			let d = new Date();

			const parts = dateStr.split(':');

			d.setHours(parts[0]);
			d.setMinutes(parts[1]);

			return d;
		};

		this.state = {
			startTime: getDateStr(
				this.props.catalogEntry &&
					this.props.catalogEntry.Schedule &&
					this.props.catalogEntry.Schedule.times[0]
			),
			endTime: getDateStr(
				this.props.catalogEntry &&
					this.props.catalogEntry.Schedule &&
					this.props.catalogEntry.Schedule.times[1]
			),
			selectedWeekdays: getWeekdaysFrom(this.props.catalogEntry),
		};
	}

	onDayClick = day => {
		let selectedWeekdays = this.state.selectedWeekdays
			? [...this.state.selectedWeekdays]
			: [];

		if (selectedWeekdays.includes(day.name)) {
			selectedWeekdays.splice(selectedWeekdays.indexOf(day.name), 1);
		} else {
			selectedWeekdays.push(day.name);
		}

		this.setState({ selectedWeekdays });
	};

	renderDay = (day, index) => {
		return (
			<Day
				key={day.name}
				day={day}
				onClick={this.onDayClick}
				selected={
					this.state.selectedWeekdays &&
					this.state.selectedWeekdays.includes(day.name)
				}
			/>
		);
	};

	renderWeekdays() {
		const days = [
			{ name: 'sunday', code: 'S' },
			{ name: 'monday', code: 'M' },
			{ name: 'tuesday', code: 'T' },
			{ name: 'wednesday', code: 'W' },
			{ name: 'thursday', code: 'T' },
			{ name: 'friday', code: 'F' },
			{ name: 'saturday', code: 'S' },
		];

		return (
			<div className="course-panel-weekdays">
				{days.map(this.renderDay)}
			</div>
		);
	}

	renderDaySelection() {
		return (
			<div className="course-panel-day-selection">
				<div className="course-panel-label">{t('whichDays')}</div>
				{this.renderWeekdays()}
			</div>
		);
	}

	updateStartTime = newDate => {
		this.setState({ startTime: newDate });
	};

	updateEndTime = newDate => {
		this.setState({ endTime: newDate });
	};

	renderTimeSelection() {
		return (
			<div className="course-panel-time-selection">
				<div className="course-panel-starttime">
					<div className="course-panel-label">{t('startTime')}</div>
					<TimePicker
						value={this.state.startTime}
						onChange={this.updateStartTime}
					/>
				</div>
				<div className="course-panel-endtime">
					<div className="course-panel-label">{t('endTime')}</div>
					<TimePicker
						value={this.state.endTime}
						onChange={this.updateEndTime}
					/>
				</div>
			</div>
		);
	}

	renderCancelCmp() {
		if (this.props.onCancel) {
			return (
				<div
					className="course-panel-cancel"
					onClick={this.props.onCancel}
				>
					{t('cancel')}
				</div>
			);
		}
	}

	onSave = done => {
		const { catalogEntry, afterSave } = this.props;

		let times = [];

		const pad = value => {
			if (value < 10) {
				return '0' + value;
			}

			return value;
		};

		if (this.state.startTime) {
			times.push(
				pad(this.state.startTime.getHours()) +
					':' +
					pad(this.state.startTime.getMinutes()) +
					':00-05:00'
			);
		}
		if (this.state.endTime) {
			times.push(
				pad(this.state.endTime.getHours()) +
					':' +
					pad(this.state.endTime.getMinutes()) +
					':00-05:00'
			);
		}

		const schedule = {
			days: [
				this.state.selectedWeekdays
					.map(d => {
						if (d === 'thursday') {
							return 'R';
						}

						if (d === 'sunday') {
							return 'N';
						}

						return d.toUpperCase().charAt(0);
					})
					.join(''),
			],
			times: times,
		};

		saveCatalogEntry(
			catalogEntry,
			{
				ProviderUniqueID: catalogEntry.ProviderUniqueID,
				Schedule: schedule,
			},
			() => {
				afterSave && afterSave();

				done && done();
			}
		);
	};

	renderSaveCmp() {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if (Cmp) {
			return <Cmp onSave={this.onSave} label={buttonLabel} />;
		}

		return null;
	}

	render() {
		return (
			<div>
				<div className="course-panel-content">
					{this.renderDaySelection()}
					{this.renderTimeSelection()}
				</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}
