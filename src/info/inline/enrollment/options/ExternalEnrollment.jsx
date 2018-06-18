import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Input } from '@nti/web-commons';
import cx from 'classnames';

import Store from '../EnrollmentOptionsStore';
import EditableItem from '../common/EditableItem';
import FieldView from '../common/FieldView';

const t = scoped('course.info.inline.enrollment.options.ExternalEnrollment', {
	title: 'External',
	description: 'Enroll using a URL',
	url: 'URL'
});

export default class ExternalEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func,
		customTitle: PropTypes.string,
		customDescription: PropTypes.string,
		className: PropTypes.string
	}

	state = {}

	componentDidMount () {
		const {option} = this.props;

		this.store = Store.getInstance();

		this.setState({url: option.enrollmentURL});
	}

	onSave = async () => {
		const {addable, option} = this.props;

		if(option.enrollmentURL === this.state.url) {
			// no need to save if the data hasn't changed
			this.onItemDeactivate();

			return;
		}

		const saveFn = addable ? this.store.addEnrollmentOption : this.store.updateEnrollmentOption;

		await saveFn(option, {
			...option,
			'enrollmentURL': this.state.url, // needed for field mapping when updating
			'enrollment_url': this.state.url
		});

		if(this.store.getError()) {
			this.setState({error: this.store.getError()});
		}
		else {
			this.onItemDeactivate();
		}
	}

	onRemove = async () => {
		const {option} = this.props;

		await this.store.removeOption(option);
	}

	onItemActivate = () => {
		const { onItemActivate, option } = this.props;

		if(onItemActivate) {
			onItemActivate(option.MimeType);
		}
	}

	onItemDeactivate = () => {
		const { onItemDeactivate, option } = this.props;

		if(onItemDeactivate) {
			onItemDeactivate(option.MimeType);
		}

		// reset error/value to defaults
		this.setState({error: null, url: this.props.option.enrollmentURL});
	}

	onURLChange = (url) => {
		this.setState({url});
	}

	renderContent () {
		const {editable, addable} = this.props;

		if(!editable && !addable) {
			return (
				<div className="field-container">
					<FieldView label={t('url')} value={this.state.url}/>
				</div>
			);
		}

		return (
			<div className="field-input-container">
				<div className="field-input">
					<div className="field-label">{t('url')}</div>
					<Input.Text value={this.state.url} onChange={this.onURLChange}/>
				</div>
			</div>
		);
	}

	render () {
		const newProps = {...this.props};
		const {customTitle, customDescription, className} = this.props;

		delete newProps.onItemActivate;
		delete newProps.onItemDeactivate;

		const cls = cx('external', className);

		return (
			<EditableItem
				title={customTitle || t('title')}
				description={customDescription || t('description')}
				className={cls}
				onItemActivate={this.onItemActivate}
				onItemDeactivate={this.onItemDeactivate}
				onSave={this.onSave}
				onRemove={this.onRemove}
				error={this.state.error}
				{...newProps}
			>
				{this.renderContent()}
			</EditableItem>
		);
	}
}
