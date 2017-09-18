import React from 'react';
import { Prompt } from 'nti-web-commons';

import CourseWizard from './wizard/CourseWizard';
import CourseEditor from './tab/CourseEditor';

export const createCourse = () => {
	return new Promise((fulfill, reject) => {
		Prompt.modal(<CourseWizard onFinish={fulfill} onCancel={reject}/>);
	});
};

export const editCourse = (course) => {
	return new Promise((fulfill, reject) => {
		Prompt.modal(<CourseEditor catalogEntry={course}onFinish={fulfill} onCancel={reject}/>);
	});
};
