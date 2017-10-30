import React from 'react';
import { Prompt } from 'nti-web-commons';

import CourseWizard from './wizard/CourseWizard';
import CourseEditor from './tab/CourseEditor';

export Inline from './inline/CourseEditor';

export const createCourse = () => {
	return new Promise((fulfill, reject) => {
		let dialog = null;

		const finish = (savedEntry) => {
			dialog && dialog.dismiss();

			fulfill(savedEntry);
		};

		const cancel = () => {
			dialog && dialog.dismiss();

			reject();
		};

		dialog = Prompt.modal(<CourseWizard onFinish={finish} onCancel={cancel}/>);
	});
};

export const editCourse = (course) => {
	return new Promise((fulfill, reject) => {
		let dialog = null;

		const finish = (savedEntry) => {
			dialog && dialog.dismiss();

			fulfill(savedEntry);
		};

		const cancel = () => {
			dialog && dialog.dismiss();

			reject();
		};

		dialog = Prompt.modal(<CourseEditor catalogEntry={course} onFinish={finish} onCancel={cancel}/>);
	});
};
