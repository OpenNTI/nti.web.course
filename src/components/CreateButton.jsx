import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

import { Editor } from '../index';

const LABELS = {
	create: 'Create New Course',
	launchWizard: 'New'
};

const t = scoped('COURSE_CREATE_BUTTON', LABELS);

export default class CreateButton extends React.Component {
	static propTypes = {
		onFinish: PropTypes.func,
		onCancel: PropTypes.func
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);
	}

	onCancel = () => {
		const { onCancel } = this.props;

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;

		onCancel && onCancel();
	}

	onFinish = () => {
		const { onFinish } = this.props;

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;

		onFinish && onFinish();
	}

	launchWizard = () => {
		Editor.createCourse();
	}

	render () {
		return (<div onClick={this.launchWizard} className="create-course-button">{t('create')}</div>);
	}
}
