import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import { getService } from '@nti/web-client';
import {DateTime, Prompt, Flyout, Layouts} from '@nti/web-commons';

import Store from '../../enrollment/options/Store';
import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import CourseMenu from '../parts/CourseSettingsMenu';

import Registry from './Registry';

const {Responsive} = Layouts;

const t = scoped('course.card.type.Enrollment', {
	starting: 'preview',
	completed: 'completed',
	confirmDrop: 'Dropping %(course)s will remove it from your library and you will no longer have access to the course materials.',
	unenrolled: 'You are no longer enrolled in %(course)s.',
	done: 'Done'
});

const propMap = {
	options: 'options'
};

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
@Store.connect(propMap)
export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func,
		store: PropTypes.shape({
			load: PropTypes.func
		}),
		options: PropTypes.array
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	componentDidMount () {
		this.setupFor(this.props);
	}

	setupFor (props) {
		const {course, store} = props;

		store.load(course.CatalogEntry);
	}

	doRequestSupport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		global.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	async getEnrollmentService () {
		const service = await getService();
		return service.getEnrollment();
	}

	doDrop = (e) => {
		const { course, onModification } = this.props;

		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(t('confirmDrop', {course: course.CatalogEntry.title})).then(() => {
			this.setState( { loading: true }, () => {
				this.getEnrollmentService().then((enrollmentService) => {
					return enrollmentService.dropCourse(course.CatalogEntry.CourseNTIID);
				}).then(() => {
					onModification && onModification();

					Prompt.alert(t('unenrolled', {course: course.CatalogEntry.title}), t('done'), {confirmButtonClass: 'ok-button', iconClass: 'done-icon'});
				}).catch((err) => {
					console.error(err); //eslint-disable-line
					// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
					// so if the dropping fails too fast, we risk automatically dismissing this alert dialog
					// when the areYouSure dialog is dismissed
					setTimeout(() => {
						Prompt.alert('Error dropping this course');
					}, 505);
				});
			});
		});
	}

	renderOptionsButton () {
		return (<div className="nti-course-card-badge black settings"><i className="icon-settings"/></div>);
	}

	renderOptions () {
		const { options } = this.props;
		const enrolledOption = options && options.find(x => x.isEnrolled());
		const drop = (enrolledOption && enrolledOption.getDropButtonLabel()) ? this.doDrop : null;

		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
			>
				<CourseMenu course={this.props.course} doRequestSupport={this.doRequestSupport} doDrop={drop} registered />
			</Flyout.Triggered>
		);
	}


	render () {
		const {course, ...otherProps} = this.props;
		const startDate = course.getStartDate();
		const endDate = course.getEndDate();
		const completed = course.CourseProgress && course.CourseProgress.Completed;
		const progress = course.CourseProgress && course.CourseProgress.PercentageProgress;
		const preview = course.CatalogEntry.Preview;
		const now = new Date();
		const badges = [];
		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (preview) {
			badges.push((
				<Badge orange>
					{t('starting')}
				</Badge>
			));
		}

		if(completed) {
			badges.push((
				<Badge green>
					<i className="icon-check completed-check"/>
					<span>{t('completed')}</span>
				</Badge>
			));
		}

		if (starting) {
			badges.push((
				<Badge blue>
					{DateTime.format(startDate)}
				</Badge>
			));
		} else if (finished) {
			badges.push((
				<Badge black>
					<i className="icon-clock-archive" />
					{getSemesterBadge(course)}
				</Badge>
			));
		}

		return (
			<LinkTo.Object object={course}>
				<Card
					{...otherProps}
					course={course.CatalogEntry}
					badges={badges}
					progress={progress}
					className="no-padding"
				/>
				{Responsive.isWebappContext() && this.renderOptions()}
			</LinkTo.Object>
		);
	}
}
