import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';

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
		course: PropTypes.object
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

		this.state = {
			stepName: STEP_ORDER[0],
			startTime: new Date('2017-08-04 09:00'),
			endTime: new Date('2017-08-04 10:15'),
			startDate: new Date(),
			endDate: new Date(),
			catalogEntry: {
				save: save,
				delete: () => { }
			}
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
		const onContinue = () => {
			const currIndex = STEP_ORDER.indexOf(this.state.stepName);

			if(currIndex === STEP_ORDER.length) {
				// do save
				// this.state.startDate, this.state.endDate
				// this.state.selectedWeekdays, this.state.startTime, this.state.endTime
				// this.state.courseName, this.state.identifier, this.state.description
			}
			else {
				if(this.state.stepName === STEPS.GET_STARTED) {
					this.state.catalogEntry.save({ ProviderUniqueID: this.state.identifier, title: this.state.courseName, identifier: this.state.identifier, description: this.state.description }).then(() => {
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

		return (<div className="course-panel-controls">
			<div className="course-panel-continue" onClick={onContinue}>Continue</div>
			<div className="course-panel-cancel">Cancel</div>
		</div>);
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
