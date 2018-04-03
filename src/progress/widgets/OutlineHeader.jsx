import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {CircularProgress} from 'nti-web-charts';
import {Hooks} from 'nti-web-session';
import {getService} from 'nti-web-client';
import {HOC} from 'nti-web-commons';

const t = scoped('course.components.GradeCard', {
	courseProgress: 'Course Progress',
	outline: 'Outline',
	getCertificate: 'Download Certificate',
	completed: 'Completed'
});

const LOAD_WAIT = 30000;

const STUDENT = 'Student';
const ADMIN = 'Admin';

export default
@Hooks.afterBatchEvents()
class OutlineHeader extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {}


	afterBatchEvents (events) {
		// if an analytics event occurs, go ahead and assume we need
		// a reload of progress data
		const {course} = this.props;

		getService().then(service => {
			service.getObject(course.NTIID).then(newCourse => {
				this.loadProgress(newCourse);
			});
		});
	}


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
			subLabel,
			type: ADMIN
		});
	}

	isStudent (course) {
		const {PreferredAccess} = course;

		return PreferredAccess && /courseinstanceenrollment/.test(PreferredAccess.MimeType);
	}


	loadStudentProgress (course) {
		const {PreferredAccess} = course;

		const courseProgress = PreferredAccess.CourseProgress;

		const completedDate = courseProgress && courseProgress.getCompletedDate();
		const isCompleted = true;//Boolean(completedDate);

		this.setState({
			...this.getStateValues(courseProgress),
			completedDate,
			isCompleted,
			type: STUDENT
		});
	}

	async loadProgress (course) {
		const isCompletable = Object.keys(course).includes('CompletionPolicy');

		if(isCompletable && this.isStudent(course)) {
			this.loadStudentProgress(course);
		} else if(isCompletable && course.hasLink('ProgressStats')) {
			this.loadAdminProgress(course);
		} else {
			// neither student nor user with access to see stats
			// or not even a completable course, just show generic "Outline" label
			this.setState({
				showDefaultHeader: true
			});
		}
	}

	componentDidMount () {
		this.loadProgress(this.props.course);
	}

	componentDidUpdate (prevProps) {
		const isDifferentCourse = prevProps.course !== this.props.course;

		// only update after a buffer time.  otherwise, updates will continually
		// be triggered
		if(isDifferentCourse || !this.lastLoadTime || (Date.now() - this.lastLoadTime > LOAD_WAIT)) {
			this.lastLoadTime = Date.now();
			this.loadProgress(this.props.course);
		}
	}

	onPreferredAccessChange () {
		// if the PreferredAccess changes and we have a completable course for
		// a student user, we should update the state to reflect the PreferredAccess
		const {course} = this.props;

		const isCompletable = Object.keys(course).includes('CompletionPolicy');

		if(isCompletable && this.isStudent(course)) {
			this.loadStudentProgress(course);
		}
	}

	renderCertificateLink () {
		const {course} = this.props;
		const {PreferredAccess} = course;
		const certLink = PreferredAccess.getLink('Certificate');

		if(!certLink) {
			return <div className="sub-label">{t('completed')}</div>;
		}

		return <div className="sub-label cert-link"><a href={certLink} target="_blank">{t('getCertificate')}</a></div>;
	}

	renderLabel () {
		const {type, isCompleted} = this.state;

		return (
			<div className="progress-labels">
				<div className="course-progress">{t('courseProgress')}</div>
				{
					type === STUDENT && isCompleted
						? this.renderCertificateLink()
						: <div className="sub-label">{this.state.subLabel}</div>
				}
			</div>
		);
	}

	render () {
		if(!this.state.courseProgress || this.state.showDefaultHeader) {
			return <div className="default-outline-header">{t('outline')}</div>;
		}

		return (
			<HOC.ItemChanges item={this.props.course.PreferredAccess} onItemChange={this.onPreferredAccessChange}>
				<div className="outline-progress-header">
					<CircularProgress width={38} height={38} value={this.state.pctComplete} showPctSymbol={false} deficitFillColor="#b8b8b8"/>
					{this.renderLabel()}
				</div>
			</HOC.ItemChanges>
		);
	}
}
