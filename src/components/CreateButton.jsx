import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import { Prompt, Flyout } from 'nti-web-commons';

import CourseWizard from './wizard/CourseWizard';
import CourseImport from './import/View';

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

	doImport = () => {

	}

	renderOptionsButton () {
		return (<div className="options"><i className="icon-settings"/></div>);
	}

	renderCreateButton () {
		return (<div className="create-course-button">{t('create')}</div>);
	}

	launchWizard = () => {
		this.modalDialog = Prompt.modal(<CourseWizard title="Create a New Course" onCancel={this.onCancel} onFinish={this.onFinish}/>,
			'course-panel-wizard');
	}

	launchImport = () => {
		this.modalDialog = Prompt.modal(<CourseImport title="Import Course" onCancel={this.onCancel} onFinish={this.onFinish}/>,
			'course-panel-import');
	}

	render () {
		return (<Flyout.Triggered
			className="create-course-options"
			trigger={this.renderCreateButton()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachFlyoutRef}
			arrow
		>
			<div>
				<div onClick={this.launchWizard} className="option">{t('launchWizard')}</div>
				<div onClick={this.launchImport} className="option">Import</div>
			</div>
		</Flyout.Triggered>);
	}
}
