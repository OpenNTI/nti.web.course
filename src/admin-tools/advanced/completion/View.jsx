import React from 'react';
import PropTypes from 'prop-types';
import {Input, Loading} from '@nti/web-commons';
import {getService} from '@nti/web-client';
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
@Store.connect({
	loading: 'loading',
	completable: 'completable',
	certificationPolicy: 'certificationPolicy',
	percentage: 'percentage',
	disabled: 'disabled',
	assignmentsDefault: 'assignmentsDefault',
	error: 'error'
})
class CourseAdminCompletion extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		completable: PropTypes.bool,
		certificationPolicy: PropTypes.bool,
		percentage: PropTypes.number,
		disabled: PropTypes.bool,
		assignmentsDefault: PropTypes.bool,
		error: PropTypes.string
	}

	state = {}

	componentDidMount () {
		const {course, store} = this.props;

		store.load(course);
	}


	componentDidUpdate (prevProps) {
		if(prevProps.percentage !== this.props.percentage) {
			this.setState({
				percentage: this.props.percentage
			});
		}
	}


	onCompletionPolicyChange = () => {
		this.onSave(!this.props.completable, this.props.percentage, this.props.certificationPolicy);
	}


	renderCompletableToggle () {
		const {completable, disabled: nonEditor} = this.props;
		const disabled = nonEditor;
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

	onAssignmentsDefaultChange = () => {
		this.saveDefaultPolicy(!this.props.assignmentsDefault);
	}

	saveDefaultPolicy (assignmentsDefault) {
		const {store} = this.props;

		store.saveDefaultPolicy(assignmentsDefault);
	}

	renderDefaultRequiredToggle (label, value, onChange, disabled) {
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{label}</div>
				<div className="control"><Input.Toggle disabled={disabled} value={value} onChange={onChange}/></div>
			</div>
		);
	}

	renderDefaultRequiredSection () {
		const {completable, disabled: nonEditor} = this.props;
		const disabled = !completable || nonEditor;
		const className = cx('default-required-container', {disabled});

		return (
			<div className={className}>
				<div className="header">{t('defaultRequired')}</div>
				<div className="items">
					{this.renderDefaultRequiredToggle(t('assignments'), this.props.assignmentsDefault, this.onAssignmentsDefaultChange, disabled)}
				</div>
			</div>
		);
	}


	renderPercentage () {
		const {completable, disabled: nonEditor} = this.props;
		const disabled = !completable || nonEditor;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('percentage')}</div>
				<div className="control"><Input.Number min={1} max={100} className="nti-text-input" constrain disabled={disabled} value={this.state.percentage} onChange={this.onPercentageChange}/></div>
			</div>
		);
	}


	onSave (completable, percentage, certificationPolicy) {
		const {store} = this.props;

		store.save(completable, percentage, certificationPolicy);
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
							{this.renderCertificateToggle()}
							{this.renderDefaultRequiredSection()}
							{this.renderPercentage()}
						</div>
					</div>
				)
				}
			</div>
		);
	}
}
