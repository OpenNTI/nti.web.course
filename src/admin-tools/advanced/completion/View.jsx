import React from 'react';
import PropTypes from 'prop-types';
import {Input, Loading} from '@nti/web-commons';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Store from './Store';

const t = scoped('course.admin-tools.advanced.completion.View', {
	cancel: 'Cancel',
	save: 'Save',
	completable: 'Completable',
	certificates: 'Award Certificate on Completion',
	percentage: 'Percentage (1 to 100)',
	defaultRequired: 'Required by Default',
	assignments: 'Assignments'
});

export default
@Store.connect([
	'loading',
	'completable',
	'certificationPolicy',
	'percentage',
	'disabled',
	'defaultRequiredDisabled',
	'defaultRequirables',
	'completableToggleDisabled',
	'percentageDisabled',
	'error'
])
class CourseAdminCompletion extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		completable: PropTypes.bool,
		certificationPolicy: PropTypes.bool,
		percentage: PropTypes.number,
		disabled: PropTypes.bool,
		defaultRequiredDisabled: PropTypes.bool,
		defaultRequirables: PropTypes.array,
		completableToggleDisabled: PropTypes.bool,
		percentageDisabled: PropTypes.bool,
		error: PropTypes.string,
		onChange: PropTypes.func
	}

	state = {}

	componentDidMount () {
		const {course, store} = this.props;

		store.load(course);
	}


	componentDidUpdate (prevProps) {
		if(this.props.course.getID() !== prevProps.course.getID()) {
			this.props.store.load(this.props.course);
		}
		else if(prevProps.percentage !== this.props.percentage) {
			this.setState({
				percentage: this.props.percentage
			});
		}
	}


	onCompletionPolicyChange = () => {
		const isCompletable = !this.props.completable;	// toggle the old value

		this.onSave(isCompletable, isCompletable ? 100 : this.props.percentage, this.props.certificationPolicy);
	}


	renderCompletableToggle () {
		const {completable, disabled: nonEditor, completableToggleDisabled} = this.props;
		const disabled = nonEditor || completableToggleDisabled;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('completable')}</div>
				<div className="control"><Input.Toggle disabled={disabled} value={completable} onChange={this.onCompletionPolicyChange}/></div>
			</div>
		);
	}

	onCertificationChange = () => {
		this.onSave(this.props.completable, this.props.percentage, !this.props.certificationPolicy);
	}

	renderCertificateToggle () {
		const {completable, disabled: nonEditor} = this.props;
		const disabled = !completable || nonEditor;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('certificates')}</div>
				<div className="control"><Input.Toggle disabled={disabled} value={this.props.certificationPolicy} onChange={this.onCertificationChange}/></div>
			</div>
		);
	}

	onPercentageChange = (percentage) => {
		if(this.percentageTimeout) {
			clearTimeout(this.percentageTimeout);
			delete this.percentageTimeout;
		}

		this.setState({percentage}, () => {
			this.percentageTimeout = setTimeout(() => {
				this.onSave(this.props.completable, percentage, this.props.certificationPolicy);
			}, 500);
		});
	}

	async saveDefaultPolicy (label, value) {
		const {store, onChange} = this.props;

		const savedCourse = await store.saveDefaultPolicy(label, value);

		if(onChange) {
			onChange(savedCourse);
		}
	}

	renderDefaultRequiredToggle = (defaultRequirable, disabled) => {
		const className = cx('completion-control', {disabled});
		const {label, isDefault} = defaultRequirable;

		return (
			<div className={className} key={label}>
				<div className="label">{label}</div>
				<div className="control">
					<Input.Toggle
						disabled={disabled}
						value={isDefault}
						onChange={() => {
							this.saveDefaultPolicy(label, !isDefault);
						}}
					/>
				</div>
			</div>
		);
	}

	renderDefaultRequiredSection () {
		const {completable, defaultRequirables, disabled: nonEditor, defaultRequiredDisabled} = this.props;
		const disabled = !completable || nonEditor || defaultRequiredDisabled;
		const className = cx('default-required-container', {disabled});

		return (
			<div className={className}>
				<div className="header">{t('defaultRequired')}</div>
				<div className="items">
					{defaultRequirables.map((defaultRequirable) => this.renderDefaultRequiredToggle(defaultRequirable, disabled))}
				</div>
			</div>
		);
	}


	renderPercentage () {
		const {completable, disabled: nonEditor, percentageDisabled} = this.props;
		const disabled = !completable || nonEditor || percentageDisabled;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('percentage')}</div>
				<div className="control"><Input.Number min={1} max={100} className="nti-text-input" constrain disabled={disabled} value={this.state.percentage} onChange={this.onPercentageChange}/></div>
			</div>
		);
	}


	async onSave (completable, percentage, certificationPolicy) {
		const {store, onChange} = this.props;

		const savedCourse = await store.save(completable, percentage, certificationPolicy);

		if(onChange) {
			onChange(savedCourse);
		}
	}


	render () {
		const {loading, error} = this.props;

		return (
			<div className="course-admin-completion">
				{loading && <Loading.Ellipsis/>}
				{!loading && (
					<div className="content">
						<div className="error">{error || ''}</div>
						<div className="inputs">
							{this.renderCompletableToggle()}
							{this.renderPercentage()}
							{this.renderCertificateToggle()}
							{this.renderDefaultRequiredSection()}
						</div>
					</div>
				)
				}
			</div>
		);
	}
}
