import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.admin-tools.advanced.completion.View', {
	cancel: 'Cancel',
	save: 'Save',
	completable: 'Completable',
	certificates: 'Award Certificate on Completion',
	percentage: 'Percentage (1 to 100)'
});

export default class CourseAdminCompletion extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {
		percentage: 0.0
	}


	componentDidMount () {
		const {course} = this.props;

		if(course.CompletionPolicy) {
			const {CatalogEntry} = course;

			this.setState({
				completable: true,
				certificationPolicy: Boolean(course.CompletionPolicy.offersCompletionCertificate),
				percentage: (course.CompletionPolicy.percentage || 0) * 100,
				disabled: !CatalogEntry || !CatalogEntry.hasLink('edit')
			});
		}
	}


	onCompletionPolicyChange = () => {
		let state = {completable: !this.state.completable, certificationPolicy: !this.state.completable};

		this.setState(state);
	}


	renderCompletableToggle () {
		const {completable, disabled: nonEditor} = this.state;
		const disabled = !completable || nonEditor;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('completable')}</div>
				<div className="control"><Input.Toggle disabled={disabled} value={completable} onChange={this.onCompletionPolicyChange}/></div>
			</div>
		);
	}

	onCertificationChange = () => {
		this.setState({certificationPolicy: !this.state.certificationPolicy});
	}

	renderCertificateToggle () {
		const {completable, disabled: nonEditor} = this.state;
		const disabled = !completable || nonEditor;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('certificates')}</div>
				<div className="control"><Input.Toggle disabled={disabled} value={this.state.certificationPolicy} onChange={this.onCertificationChange}/></div>
			</div>
		);
	}

	onPercentageChange = (percentage) => {
		this.setState({percentage});
	}


	renderPercentage () {
		const {completable, disabled: nonEditor} = this.state;
		const disabled = !completable || nonEditor;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('percentage')}</div>
				<div className="control"><Input.Number min={1} max={100} className="nti-text-input" constrain disabled={disabled} value={this.state.percentage} onChange={this.onPercentageChange}/></div>
			</div>
		);
	}


	onSave = async () => {
		const {completable, percentage, certificationPolicy} = this.state;
		const {course} = this.props;

		const service = await getService();

		if(completable) {
			await service.put(course.getLink('CompletionPolicy'), {
				MimeType: 'application/vnd.nextthought.completion.aggregatecompletionpolicy',
				percentage: percentage ? percentage / 100.0 : 0,
				'offers_completion_certificate': Boolean(certificationPolicy)
			});
		}
		else {
			// delete from CompletionPolicy?
			const encodedID = encodeURIComponent(course.NTIID);

			await service.delete(course.getLink('CompletionPolicy') + '/' + encodedID);
		}

		await course.refresh();
	}


	renderBottomControls () {
		if(!this.props.course || this.state.disabled) {
			return null;
		}

		return (
			<div className="bottom-controls">
				<div className="buttons">
					<div className="save" onClick={this.onSave}>{t('save')}</div>
				</div>
			</div>
		);
	}


	render () {
		return (
			<div className="course-admin-completion">
				<div className="inputs">
					{this.renderCompletableToggle()}
					{this.renderCertificateToggle()}
					{this.renderPercentage()}
				</div>
				{this.renderBottomControls()}
			</div>
		);
	}
}
