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

	async componentDidMount () {
		const {course} = this.props;
		const {PreferredAccess} = course;
		const isAdmin = course.isAdministrative;

		let courseProgress = PreferredAccess.CourseProgress;

		if(isAdmin) {
			courseProgress = await course.fetchLink('ProgressStats');
		}

		const itemsComplete = (courseProgress && courseProgress.AbsoluteProgress) || 0;
		const itemsTotal = (courseProgress && courseProgress.MaxPossibleProgress) || 0;

		const completedDate = courseProgress.CompletedDate;
		const isCompleted = courseProgress && courseProgress.CompletedDate;
		const pctComplete = (courseProgress && courseProgress.PercentageProgress * 100) || 0;
		const remainingItems = itemsTotal - itemsComplete;

		let subLabel = '0 Items Remaining';
		if(isCompleted) {
			subLabel = 'Completed';
		}
		else {
			subLabel = remainingItems === 1 ? '1 Item Remaining' : remainingItems + ' Items Remaining';
		}

		this.setState({
			isCompleted,
			pctComplete,
			completedDate,
			subLabel
		});
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
		return (
			<div className="outline-progress-header">
				<CircularProgress width="38" height="38" value={this.state.pctComplete} showPctSymbol={false} deficitFillColor="#b8b8b8"/>
				{this.renderLabel()}
			</div>
		);
	}
}