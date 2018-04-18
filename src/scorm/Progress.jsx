import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CircularProgress} from '@nti/web-charts';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

const t = scoped('scorm.progress', {
	classCompletion: 'Class Completion',
	passRate: 'Pass Rate',
	avgTime: 'Avg Time Spent',
	passed: 'Passed',
	failed: 'Bummer..',
	passedMsg: 'Congratulations, you earned a satisfactory score.',
	failedMsg: 'Unfortunately, you did not earn a satisfactory score.',
	contactInstructor: 'Contact Instructor',
	noData: 'No Data Yet',
	noDataMsg: 'Data about your course will appear here.'
});

export default class Progress extends Component {
	static propTypes = {
		bundle: PropTypes.shape({
			getScormCourse: PropTypes.func.isRequired,
			getID: PropTypes.func.isRequired,
			getLink: PropTypes.func.isRequired,
			fetchLink: PropTypes.func.isRequired
		}),
		isAdmin: PropTypes.bool
	}

	state = {
	}

	componentDidMount () {
		this.loadData(this.props.bundle);
	}


	componentDidUpdate (prevProps) {
		if(prevProps.bundle !== this.props.bundle) {
			this.loadData(this.props.bundle);
		}
	}

	async loadData (bundle) {
		if(this.props.isAdmin) {
			// load ProgressStats
			const courseProgress = await bundle.fetchLink('ProgressStats');

			this.setState({
				pctProgress: Math.floor((courseProgress.PercentageProgress || 0) * 100),
				courseProgress
			});
		}
		else {
			// get from PreferredAccess
			const {PreferredAccess} = bundle;

			const courseProgress = PreferredAccess.CourseProgress;

			const completedItem = (courseProgress || {}).CompletedItem;

			const completedDate = courseProgress && courseProgress.getCompletedDate();
			const isCompleted = Boolean(completedDate);

			this.setState({
				completedDate,
				completedItem,
				isCompleted
			});
		}
	}


	renderLabeledValue (label, value, className) {
		const cls = cx('labeled-value', className);

		return (
			<div className={cls}>
				<div className="label">{label}</div>
				<div className="value">{value}</div>
			</div>
		);
	}


	renderAdmin () {
		return (
			<div className="admin-view">
				{this.state.courseProgress && <CircularProgress value={this.state.pctProgress} showPercentSymbol/>}
			</div>
		);
	}


	renderNotCompleted () {
		return (
			<div className="not-completed">
				<div className="title">{t('noData')}</div>
				<div className="message">{t('noDataMsg')}</div>
			</div>
		);
	}


	renderCompletionStatus (passed) {
		if(passed == null) {
			return this.renderNotCompleted();
		}

		const className = passed ? 'passed' : 'failed';
		const title = passed ? t('passed') : t('failed');
		const message = passed ? t('passedMsg') : t('failedMsg');

		const statusCls = cx('completion-status', { passed });

		return (
			<div className={statusCls}>
				<div className={className}/>
				<div className="title">{title}</div>
				<div className="message">{message}</div>
			</div>
		);
	}

	renderStudent () {
		// TODO: get success flag from course progress
		const {completedItem} = this.state;

		let passed = null;

		if(completedItem) {
			passed = completedItem.Success;
		}

		// should we support contact instructor in the future?
		// {passed !== null && <a className="contact-instructor-button" href="">{t('contactInstructor')}</a>}

		return (
			<div className="student-view">
				{this.renderCompletionStatus(passed)}
			</div>
		);
	}


	render () {
		const {isAdmin} = this.props;

		return (
			<div className="scorm-progress">
				<div className="progress-content">
					{isAdmin ? this.renderAdmin() : this.renderStudent()}
				</div>
			</div>
		);
	}
}
