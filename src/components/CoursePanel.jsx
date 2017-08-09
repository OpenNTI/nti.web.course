import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';
import { Prompt } from 'nti-web-commons';

import CourseMeta from './CourseMeta';
import DayTime from './DayTime';
import CourseDatesPicker from './CourseDatesPicker';
import InviteInstructors from './InviteInstructors';

const STEPS = {
	GET_STARTED: 'Get Started',
	DAY_TIME: 'Day & Time',
	CHOOSE_COURSE_DATES: 'Choose Course Dates',
	INVITE_INSTRUCTORS: 'Invite Instructors'
};

const STEP_ORDER = [STEPS.GET_STARTED, STEPS.DAY_TIME, STEPS.CHOOSE_COURSE_DATES, STEPS.INVITE_INSTRUCTORS];

export default class CoursePanel extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func
	}

	constructor (props) {
		super(props);

		const save = (data) => {
			return getService().then((service) => {
				return Models.courses.CatalogEntry.getFactory(service).create({key: data.identifier}).then((createdEntry) => {
					this.setState({catalogEntry: createdEntry});
					return createdEntry.save(data);
				});
			});
		};

		let catalogEntry = this.props.catalogEntry
			? this.props.catalogEntry
			: {
				save: save,
				delete: () => { return Promise.resolve(); }
			};

		const getWeekdaysFrom = (entry) => {
			if(entry && entry.Schedule) {
				const days = entry.Schedule.days && entry.Schedule.days[0];

				let selectedWeekdays = [];

				if(days.indexOf('M') >= 0) {
					selectedWeekdays.push('monday');
				}
				if(days.indexOf('T') >= 0) {
					selectedWeekdays.push('tuesday');
				}
				if(days.indexOf('W') >= 0) {
					selectedWeekdays.push('wednesday');
				}
				if(days.indexOf('R') >= 0) {
					selectedWeekdays.push('thursday');
				}
				if(days.indexOf('F') >= 0) {
					selectedWeekdays.push('friday');
				}
				if(days.indexOf('S') >= 0) {
					selectedWeekdays.push('saturday');
				}
				if(days.indexOf('N') >= 0) {
					selectedWeekdays.push('sunday');
				}

				return selectedWeekdays;
			}

			return [];
		};

		const getDateStr = (dateStr) => {
			if(!dateStr) {
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
			stepName: STEP_ORDER[0],
			courseName: this.props.catalogEntry ? this.props.catalogEntry.title : null,
			description: this.props.catalogEntry ? this.props.catalogEntry.description : null,
			startDate: this.props.catalogEntry ? new Date(this.props.catalogEntry.StartDate) : new Date('2017-08-04 09:00'),
			endDate: this.props.catalogEntry ? new Date(this.props.catalogEntry.EndDate) : new Date('2017-08-04 10:15'),
			startTime: getDateStr(this.props.catalogEntry && this.props.catalogEntry.Schedule && this.props.catalogEntry.Schedule.times[0]),
			endTime: getDateStr(this.props.catalogEntry && this.props.catalogEntry.Schedule && this.props.catalogEntry.Schedule.times[1]),
			selectedWeekdays: getWeekdaysFrom(this.props.catalogEntry),
			catalogEntry
		};
	}

	goToStep (stepName) {
		this.setState({stepName: stepName});
	}

	renderTitle () {
		if(this.props.title) {
			return (<div className="course-panel-header-title">{this.props.title}</div>);
		}

		return null;
	}

	renderStepName () {
		return (<div className="course-panel-header-stepname">{this.state.stepName}</div>);
	}

	renderBackButton () {
		const currIndex = STEP_ORDER.indexOf(this.state.stepName);

		if(currIndex === 0) {
			// first step, can't go back, must look to the future
			return null;
		}

		const onBack = () => {
			this.setState({stepName : STEP_ORDER[currIndex - 1]});
		};

		return (<div className="back" onClick={onBack}><i className="icon-chevron-left"/></div>);
	}

	renderCloseButton () {
		const close = () => {

		};

		return (<div className="close" onClick={close}><i className="icon-light-x"/></div>);
	}

	renderHeader () {
		return (<div className="course-panel-header">
			{this.renderCloseButton()}
			{this.renderBackButton()}
			<div className="header-text">
				{this.renderTitle()}
				{this.renderStepName()}
			</div>
		</div>);
	}

	renderContent () {
		return (<div className="course-panel-content">{this.renderStep()}</div>);
	}

	renderGetStartedStep () {
		const updateState = (courseName, identifier, description) => {
			this.setState({courseName, identifier, description});
		};

		return (<CourseMeta updateState={updateState} courseName={this.state.courseName}
			identifier={this.state.identifier} description={this.state.description}/>);
	}

	renderDayTimeStep () {
		const weekdayClicked = (weekday) => {
			let selectedWeekdays = this.state.selectedWeekdays ? [...this.state.selectedWeekdays] : [];

			if(selectedWeekdays.includes(weekday)) {
				selectedWeekdays.splice(selectedWeekdays.indexOf(weekday), 1);
			}
			else {
				selectedWeekdays.push(weekday);
			}

			this.setState({selectedWeekdays : selectedWeekdays});
		};

		const updateStartTime = (newTime) => {
			this.setState({startTime : newTime});
		};

		const updateEndTime = (newTime) => {
			this.setState({endTime : newTime});
		};

		return (<DayTime selectedWeekdays={this.state.selectedWeekdays} weekdayClicked={weekdayClicked}
			startTime={this.state.startTime} updateStartTime={updateStartTime}
			endTime={this.state.endTime} updateEndTime={updateEndTime}/>);
	}

	renderChooseCourseDatesStep () {
		const updateStartDate = (newStartDate) => {
			this.setState({startDate: newStartDate});
		};

		const updateEndDate = (newEndDate) => {
			this.setState({endDate: newEndDate});
		};

		return (<CourseDatesPicker startDate={this.state.startDate} updateStartDate={updateStartDate}
			endDate={this.state.endDate} updateEndDate={updateEndDate}/>);
	}

	renderInviteInstructorsStep () {
		return (<InviteInstructors/>);
	}

	renderStep () {
		if(STEPS.GET_STARTED === this.state.stepName) {
			return this.renderGetStartedStep();
		}
		else if(STEPS.DAY_TIME === this.state.stepName) {
			return this.renderDayTimeStep();
		}
		else if(STEPS.CHOOSE_COURSE_DATES === this.state.stepName) {
			return this.renderChooseCourseDatesStep();
		}
		else if(STEPS.INVITE_INSTRUCTORS === this.state.stepName) {
			return this.renderInviteInstructorsStep();
		}

		return null;
	}

	renderBottomControls () {
		const { onFinish } = this.props;

		const doContinue = () => {
			const currIndex = STEP_ORDER.indexOf(this.state.stepName);

			if(currIndex === STEP_ORDER.length - 1) {
				// finalize, dismiss
				if(onFinish) {
					onFinish(this.state.catalogEntry);
				}
			}
			else {
				if(this.state.stepName === STEPS.GET_STARTED) {
					this.state.catalogEntry.save({ ProviderUniqueID: this.state.identifier, title: this.state.courseName, identifier: this.state.identifier, description: this.state.description }).then(() => {
						this.setState({stepName : STEP_ORDER[currIndex + 1]});
					});
				}
				else if(this.state.stepName === STEPS.DAY_TIME) {
					let times = [];

					const pad = (value) => {
						if(value < 10) {
							return '0' + value;
						}

						return value;
					};

					if(this.state.startTime) {
						times.push(pad(this.state.startTime.getHours()) + ':' + this.state.startTime.getMinutes() + ':00-05:00');
					}
					if(this.state.endTime) {
						times.push(pad(this.state.endTime.getHours()) + ':' + this.state.endTime.getMinutes() + ':00-05:00');
					}

					const schedule = {
						days: [
							this.state.selectedWeekdays.map((d) => {
								if(d === 'thursday') {
									return 'R';
								}

								if(d === 'sunday') {
									return 'N';
								}

								return d.toUpperCase().charAt(0);
							}).join('')
						],
						times: times
					};

					this.state.catalogEntry.save({ ProviderUniqueID: this.state.identifier, Schedule: schedule }).then(() => {
						this.setState({stepName : STEP_ORDER[currIndex + 1]});
					});
				}
				else if(this.state.stepName === STEPS.CHOOSE_COURSE_DATES) {
					this.state.catalogEntry.save({ ProviderUniqueID: this.state.identifier, StartDate: this.state.startDate, EndDate: this.state.endDate }).then(() => {
						this.setState({stepName : STEP_ORDER[currIndex + 1]});
					});
				}
				else {
					this.setState({stepName : STEP_ORDER[currIndex + 1]});
				}
			}
		};

		const doCancel = () => {
			if(this.state.catalogEntry) {
				Prompt.areYouSure('Canceling will cause the new course to not be saved.').then(() => {
					this.state.catalogEntry.delete().then(() => {
						this.cancel();
					});
				});
			}
			else {
				this.cancel();
			}
		};

		return (<div className="course-panel-controls">
			<div className="course-panel-continue" onClick={doContinue}>Continue</div>
			<div className="course-panel-cancel" onClick={doCancel}>Cancel</div>
		</div>);
	}

	cancel () {
		if(this.props.onCancel) {
			this.props.onCancel();
		}
	}

	render () {
		return (<div className="course-panel">
			{this.renderHeader()}
			{this.renderContent()}
			{this.renderBottomControls()}
		</div>
		);
	}
}
