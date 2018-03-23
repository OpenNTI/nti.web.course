import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {CircularProgress} from 'nti-web-charts';

const t = scoped('course.components.GradeCard', {
	courseProgress: 'Course Progress'
});

export default class OutlineHeader extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {}


	getStateValues (courseProgress, isCompleted) {
		const itemsComplete = (courseProgress && courseProgress.AbsoluteProgress) || 0;
		const itemsTotal = (courseProgress && courseProgress.MaxPossibleProgress) || 0;

		const pctComplete = Math.floor(((courseProgress || {}).PercentageProgress * 100) || 0);
		const remainingItems = itemsTotal - itemsComplete;

		let subLabel = '0 Items Remaining';
		if(isCompleted) {
			subLabel = 'Completed';
		}
		else {
			subLabel = remainingItems === 1 ? '1 Item Remaining' : remainingItems + ' Items Remaining';
		}

		return {
			courseProgress,
			pctComplete,
			subLabel
		};
	}

	async loadAdminProgress (course) {
		const courseProgress = await course.fetchLink('ProgressStats');

		const studentsFinished = courseProgress.CountCompleted || 0;

		const subLabel = studentsFinished === 1 ? '1 Student Finished' : studentsFinished + ' Students Finished';

		this.setState({
			...this.getStateValues(courseProgress),
			subLabel
		});
	}


	loadStudentProgress (course) {
		const {PreferredAccess} = course;

		const courseProgress = PreferredAccess.CourseProgress;

		const completedDate = courseProgress && courseProgress.getCompletedDate();
		const isCompleted = Boolean(completedDate);

		this.setState({
			...this.getStateValues(courseProgress),
			completedDate,
			isCompleted
		});
	}

	async loadProgress (course) {
		if(course.isAdministrative) {
			this.loadAdminProgress(course);
		} else {
			this.loadStudentProgress(course);
		}
	}

	componentDidMount () {
		this.loadProgress(this.props.course);
	}

	componentDidUpdate (prevProps) {
		if(prevProps.course !== this.props.course) {
			this.loadProgress(this.props.course);
		}
	}

	renderLabel () {
		return (
			<div className="progress-labels">
				<div className="course-progress">{t('courseProgress')}</div>
				<div className="sub-label">{this.state.subLabel}</div>
			</div>
		);
	}

	render () {
		if(!this.state.courseProgress) {
			return null;
		}

		return (
			<div className="outline-progress-header">
				<CircularProgress width="38" height="38" value={this.state.pctComplete} showPctSymbol={false} deficitFillColor="#b8b8b8"/>
				{this.renderLabel()}
			</div>
		);
	}
}
