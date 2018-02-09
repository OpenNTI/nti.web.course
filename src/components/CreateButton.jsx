import React from 'react';
import { scoped } from 'nti-lib-locale';

import { Editor } from '../index';

const t = scoped('course.components.CreateButton', {
	label: 'Create New Course',
});

export default class CreateButton extends React.Component {
	constructor (props) {
		super(props);
	}

	launchWizard = () => {
		Editor.createCourse();
	}

	render () {
		return (<div onClick={this.launchWizard} className="create-course-button">{t('label')}</div>);
	}
}
