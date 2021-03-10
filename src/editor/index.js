import React from 'react';

import { Prompt } from '@nti/web-commons';

import CourseWizard from './wizard/CourseWizard';
import CourseEditor from './tab/CourseEditor';

export const createCourse = (onCourseModified, template) => {
	let dialog = null;

	return new Promise((fulfill, reject) => {
		dialog = Prompt.modal(
			<CourseWizard
				template={template}
				onFinish={fulfill}
				onCancel={reject}
				onCourseModified={onCourseModified}
			/>,
			{ className: CourseWizard.modalClassName }
		);
	})
		.then(savedEntry => {
			dialog && dialog.dismiss();

			return savedEntry;
		})
		.catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
};

export const editCourse = course => {
	let dialog = null;

	return new Promise((fulfill, reject) => {
		dialog = Prompt.modal(
			<CourseEditor
				catalogEntry={course}
				onFinish={fulfill}
				onCancel={reject}
			/>
		);
	})
		.then(savedEntry => {
			dialog && dialog.dismiss();

			return savedEntry;
		})
		.catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
};
