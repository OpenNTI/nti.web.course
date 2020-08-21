import './AddEnrollmentOption.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Panels} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import OptionText, {TITLE, DESCRIPTION} from './common/OptionText';

const t = scoped('course.components.enrollment.AddEnrollmentOption', {
	title: 'Add an Option'
});

export default class AddEnrollmentOption extends React.Component {
	static propTypes = {
		availableOptions: PropTypes.array,
		existingOptions: PropTypes.array,
		onDismiss: PropTypes.func,
		onFinish: PropTypes.func
	}

	static show (availableOptions, existingOptions) {
		let dialog = null;

		return new Promise((fulfill, reject) => {
			dialog = Prompt.modal(<AddEnrollmentOption onFinish={fulfill} onCancel={reject} availableOptions={availableOptions} existingOptions={existingOptions}/>, 'add-enrollment-option');
		}).then((selectedType) => {
			dialog && dialog.dismiss();

			return selectedType;
		}).catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
	}

	selectOption (option) {
		const {onFinish} = this.props;

		if(onFinish) {
			onFinish(option);
		}
	}

	renderDisabledOption = (option) => {
		return <div key={option.MimeType} className="option disabled" onClick={() => { this.selectOption(option); }}><OptionText option={option} type={TITLE}/><OptionText option={option} type={DESCRIPTION}/></div>;
	}

	renderOption = (option) => {
		return <div key={option.MimeType} className="option addable" onClick={() => { this.selectOption(option); }}><OptionText option={option} type={TITLE}/><OptionText option={option} type={DESCRIPTION}/></div>;
	}

	render () {
		const {onDismiss} = this.props;

		return (
			<div className="content">
				<Panels.TitleBar title={t('title')} iconAction={onDismiss} />
				<div className="enrollment-options">
					{this.props.availableOptions.map(this.renderOption)}
					{this.props.existingOptions.map(this.renderDisabledOption)}
				</div>
			</div>
		);
	}
}
