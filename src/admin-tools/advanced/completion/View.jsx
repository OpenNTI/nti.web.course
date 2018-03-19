import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'nti-web-commons';
import {getService} from 'nti-web-client';
import cx from 'classnames';
import { scoped } from 'nti-lib-locale';

const t = scoped('course.admin-tools.advanced.completion.View', {
	cancel: 'Cancel',
	save: 'Save',
	completable: 'Completable',
	count: 'Number of Completable Items',
	percentage: 'Percentage'
});

export default class CourseAdminCompletion extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {
		count: 0,
		percentage: 0.0
	}


	componentDidMount () {
		const {course} = this.props;

		if(course.CompletionPolicy) {
			this.setState({completable: true, percentage: course.CompletionPolicy.percentage});
		}
	}


	onCompletionPolicyChange = () => {
		this.setState({completable: !this.state.completable});
	}


	renderCompletableToggle () {
		return (
			<div className="completion-control">
				<div className="label">{t('completable')}</div>
				<div className="control"><Input.Toggle value={this.state.completable} onChange={this.onCompletionPolicyChange}/></div>
			</div>
		);
	}


	onCountChange = (count) => {
		this.setState({count});
	}


	renderCount () {
		const disabled = !this.state.completable;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('count')}</div>
				<div className="control"><Input.Text disabled={disabled} value={this.state.count} onChange={this.onCountChange}/></div>
			</div>
		);
	}


	onPercentageChange = (percentage) => {
		this.setState({percentage});
	}


	renderPercentage () {
		const disabled = !this.state.completable;
		const className = cx('completion-control', {disabled});

		return (
			<div className={className}>
				<div className="label">{t('percentage')}</div>
				<div className="control"><Input.Text disabled={disabled} value={this.state.percentage} onChange={this.onPercentageChange}/></div>
			</div>
		);
	}


	onSave = () => {
		const {completable, count, percentage} = this.state;
		const {course} = this.props;

		if(completable) {
			getService().then(service => {
				service.put(course.getLink('CompletionPolicy'), {
					MimeType: 'application/vnd.nextthought.completion.aggregatecompletionpolicy',
					count,
					percentage
				});
			});
		}
		else {
			// delete from CompletionPolicy?
			getService().then(service => {
				const encodedID = encodeURIComponent(course.NTIID);

				service.delete(course.getLink('CompletionPolicy') + '/' + encodedID);
			});
		}
	}


	renderBottomControls () {
		if(!this.props.course) {
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
					{this.renderCount()}
					{this.renderPercentage()}
				</div>
				{this.renderBottomControls()}
			</div>
		);
	}
}
