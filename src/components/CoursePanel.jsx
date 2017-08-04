import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import DayTime from './DayTime';

const STEPS = {
	DAY_TIME: 'Day & Time'
};

export default class CoursePanel extends React.Component {
	static propTypes = {
		title: PropTypes.string
	}

	constructor (props) {
		super(props);
		this.state = {
			stepName: STEPS.DAY_TIME,
			startTime: moment('2017-08-04 09:00'),
			endTime: moment('2017-08-04 10:15')
		};
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

	renderHeader () {
		return (<div className="course-panel-header">
			{this.renderTitle()}
			{this.renderStepName()}
		</div>);
	}

	renderContent () {
		return (<div className="course-panel-content">{this.renderStep()}</div>);
	}

	renderStep () {
		if(STEPS.DAY_TIME === this.state.stepName) {
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

		return null;
	}

	renderBottomControls () {
		return (<div className="course-panel-controls">
			<div className="course-panel-continue">Continue</div>
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
