import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { dispatch } from '@nti/lib-dispatcher';
import { Prompt } from '@nti/web-commons';

import Store from './options/Store';

const t = scoped('course.enrollment.DropCourseButton', {
	confirmDrop:
		'Dropping %(course)s will remove it from your library and you will no longer have access to the course materials.',
	unenrolled: 'You are no longer enrolled in %(course)s.',
	drop: 'Drop Course',
	done: 'Done',
	error: 'Error dropping this course',
});

class DropCourseButton extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		store: PropTypes.shape({
			load: PropTypes.func,
		}),
		options: PropTypes.array,
	};

	componentDidMount() {
		this.setupFor(this.props);
	}

	setupFor(props) {
		const { course, store } = props;

		store.load(course.CatalogEntry);
	}

	async getEnrollmentService() {
		const service = await getService();
		return service.getEnrollment();
	}

	doDrop = e => {
		const { course } = this.props;

		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(
			t('confirmDrop', { course: course.CatalogEntry.title })
		).then(() => {
			this.getEnrollmentService()
				.then(enrollmentService => {
					return enrollmentService.dropCourse(
						course.CatalogEntry.CourseNTIID
					);
				})
				.then(() => {
					dispatch('course:drop');

					Prompt.alert(
						t('unenrolled', { course: course.CatalogEntry.title }),
						t('done'),
						{
							confirmButtonClass: 'ok-button',
							iconClass: 'done-icon',
						}
					);
				})
				.catch(err => {
					console.error(err); //eslint-disable-line
					// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
					// so if the dropping fails too fast, we risk automatically dismissing this alert dialog
					// when the areYouSure dialog is dismissed
					setTimeout(() => {
						Prompt.alert(t('error'));
					}, 505);
				});
		});
	};

	render() {
		const { options } = this.props;
		const enrolledOption = options && options.find(x => x.isEnrolled());
		const drop =
			enrolledOption && enrolledOption.getDropButtonLabel()
				? this.doDrop
				: null;

		return drop ? (
			<div onClick={drop} className="option delete-course">
				<span className="label">{t('drop')}</span>
			</div>
		) : null;
	}
}

export default decorate(DropCourseButton, [Store.connect(['options'])]);
