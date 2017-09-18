import React from 'react';
import { Prompt } from 'nti-web-commons';

import CourseWizard from './wizard/CourseWizard';
import CourseEditor from './tab/CourseEditor';

export const createCourse = () => {
	return new Promise((fulfill, reject) => {
		const onFinish = () => {
			this.dialog && this.dialog.dismiss();

			fulfill();
		};

		const onCancel = () => {
			this.dialog && this.dialog.dismiss();

			reject();
		};

		this.dialog = Prompt.modal(<CourseWizard onFinish={onFinish} onCancel={onCancel}/>);
	});
};

export const editCourse = (course) => {
	return new Promise((fulfill, reject) => {
		const onFinish = () => {
			this.dialog && this.dialog.dismiss();

			fulfill();
		};

		const onCancel = () => {
			this.dialog && this.dialog.dismiss();

			reject();
		};

		this.dialog = Prompt.modal(<CourseEditor catalogEntry={course}onFinish={onFinish} onCancel={onCancel}/>);
	});
};
