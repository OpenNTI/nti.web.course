import React from 'react';
import { scoped } from 'nti-lib-locale';

import { Editor } from '../index';

const LABELS = {
	create: 'Create New Course',
	launchWizard: 'New'
};

const t = scoped('COURSE_CREATE_BUTTON', LABELS);

export default class CreateButton extends React.Component {
	constructor (props) {
		super(props);
	}

	launchWizard = () => {
		Editor.createCourse();
	}

	render () {
		return (<div onClick={this.launchWizard} className="create-course-button">{t('create')}</div>);
	}
}
