import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { getService, reportError } from '@nti/web-client';
import { dispatch } from '@nti/lib-dispatcher';
import { Prompt } from '@nti/web-commons';

import Store from './enrollment/options/Store';

const t = scoped('course.enrollment.DropCourseButton', {
	confirmDrop:
		'Dropping %(course)s will remove it from your library and you will no longer have access to the course materials.',
	unenrolled: 'You are no longer enrolled in %(course)s.',
	drop: 'Drop Course',
	done: 'Done',
	error: 'Error dropping this course.',
});

DropCourseOption.propTypes = {
	as: PropTypes.any,
	course: PropTypes.object.isRequired,
	store: PropTypes.shape({
		load: PropTypes.func,
	}),
	options: PropTypes.array,
	onDrop: PropTypes.func,
};
function DropCourseOption({
	as: Cmp = 'div',
	course,
	store,
	options,
	onDrop,
	...props
}) {
	const enrolledOption = options?.find(x => x.isEnrolled());
	const canDrop = enrolledOption?.getDropButtonLabel() || !!onDrop;

	useEffect(() => {
		store.load(course.CatalogEntry);
	}, [store, course]);

	const drop = useCallback(
		e => {
			e.stopPropagation();
			e.preventDefault();
			if (onDrop) onDrop();
			else dropCourse(course);
		},
		[course, onDrop]
	);

	return !canDrop ? null : (
		<Cmp onClick={drop} {...props}>
			{t('drop')}
		</Cmp>
	);
}

export default decorate(DropCourseOption, [Store.connect(['options'])]);

async function dropCourse(course) {
	const service = await getService();
	try {
		await Prompt.areYouSure(
			t('confirmDrop', { course: course.CatalogEntry.title })
		);

		const enrollmentService = await service.getEnrollment();
		await enrollmentService.dropCourse(course.CatalogEntry.CourseNTIID);

		dispatch('course:drop');

		await Prompt.alert(
			t('unenrolled', { course: course.CatalogEntry.title }),
			t('done'),
			{
				confirmButtonClass: 'ok-button',
				iconClass: 'done-icon',
			}
		);
	} catch (err) {
		if (err.message === 'Prompt Canceled') {
			return;
		}

		const { message, Message: msg = message } = err || {};

		if (!msg) {
			reportError(err);
		}

		Prompt.alert(t('error') + '<br>' + msg);
	}
}
