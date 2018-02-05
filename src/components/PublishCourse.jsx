import React from 'react';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {Loading, Prompt, Flyout, DateTime, Input} from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';
import cx from 'classnames';

import {saveCatalogEntry} from '../editor/Actions';

import EnrollmentOptions from './EnrollmentOptions';

const LABELS = {
	ready: 'Ready to Launch?',
	headerSubText: 'That\'s exciting!  Review a couple settings before the big moment.',
	cancel: 'Cancel',
	publish: 'Update Visibility',
	publiclyAvailable: 'Visible in Catalog',
	previewMode: 'Preview Mode',
	nullPreview: 'Based on start date',
	previewOn: 'On',
	previewOnDesc: 'Course is not visible',
	previewOff: 'Off',
	previewOffDesc: 'Course is visible',
	noDateFound: 'No start date found'
};

const t = scoped('nti-web-course.navigation.CourseNavMenu', LABELS);

export default class PublishCourse extends React.Component {
	static propTypes = {
		course: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),
		onFinish: PropTypes.func,
		onCancel: PropTypes.func
	}

	constructor (props) {
		super(props);
		this.state = {};

		const { course } = props;

		if(typeof course === 'string') {
			this.loadCourse();
		}
		else {
			this.state = {
				course,
				isNonPublic: course.is_non_public,
				previewMode: course.PreviewRawValue
			};
		}
	}

	attachFlyoutRef = x => this.flyout = x

	static show (course) {
		let dialog = null;

		return new Promise((fulfill, reject) => {
			dialog = Prompt.modal(<PublishCourse onFinish={fulfill} onCancel={reject} course={course}/>);
		}).then((savedEntry) => {
			dialog && dialog.dismiss();

			return savedEntry;
		}).catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
	}

	async loadCourse () {
		const { course } = this.props;

		const service = await getService();
		const courseObject = await service.getObject(course);

		const catalogEntry = courseObject.CatalogEntry || courseObject; // will handle CatalogEntry IDs and CourseInstance IDs as course prop

		this.setState({
			course: catalogEntry,
			isNonPublic: course.is_non_public,
			previewMode: course.PreviewRawValue
		});
	}

	renderHeader () {
		return (
			<div className="header">
				<div className="text-large">{t('ready')}</div>
				<div className="text-sub">{t('headerSubText')}</div>
				<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>
			</div>
		);
	}

	cancel = () => {
		const { onCancel } = this.props;

		onCancel && onCancel();
	}

	renderBottomControls () {
		if(!this.state.course) {
			return null;
		}

		return (
			<div className="bottom-controls">
				<div className="buttons">
					<div className="cancel" onClick={this.cancel}>{t('cancel')}</div>
					<div className="publish" onClick={this.onSave}>{t('publish')}</div>
				</div>
			</div>
		);
	}

	renderPreviewLabel () {
		const { previewMode } = this.state;
		const { StartDate } = this.state.course;

		let label = t('previewOff');
		let desc = t('previewOffDesc');
		let warning = false;

		if(previewMode === null) {
			label = t('nullPreview');
			desc = StartDate ? DateTime.format(StartDate, 'MMMM Do YYYY, h:mm a') : t('noDateFound');

			if(!StartDate) {
				warning = true;
			}
		}
		else if(previewMode) {
			label = t('previewOn');
			desc = t('previewOnDesc');
		}

		return (
			<div className="preview-mode-label control">
				<div className="content">
					{this.renderPreviewOption(label, desc, warning)}
				</div>
				<i className="icon-chevron-down"/>
			</div>
		);
	}

	enablePreviewMode = () => {
		this.onPreviewChange(true);
	}

	disablePreviewMode = () => {
		this.onPreviewChange(false);
	}

	nullOutPreviewMode = () => {
		this.onPreviewChange(null);
	}

	renderBasedOnStartDateOption () {
		const { StartDate } = this.state.course;

		return (
			<div className="preview-option preview-mode-none" onClick={this.nullOutPreviewMode}>
				<div>Based on start date</div>
				<div className="preview-date-info">{DateTime.format(StartDate, 'MMMM Do YYYY, h:mm a')}</div>
			</div>
		);
	}

	renderPreviewOption (label, info, warning, onClick) {
		const className = cx('preview-date-info', { warning });

		return (
			<div className="preview-option preview-mode-none" onClick={onClick}>
				<div>{label}</div>
				<div className={className}>{info}</div>
			</div>
		);
	}

	renderPreviewWidget () {
		const { course } = this.state;
		const { StartDate } = course;

		return (<Flyout.Triggered
			className="preview-mode-widget"
			trigger={this.renderPreviewLabel()}
			ref={this.attachFlyoutRef}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
		>
			<div>
				{this.renderPreviewOption(t('previewOn'), t('previewOnDesc'), false, this.enablePreviewMode)}
				{this.renderPreviewOption(t('previewOff'), t('previewOffDesc'), false, this.disablePreviewMode)}
				{this.renderPreviewOption(t('nullPreview'), StartDate ? DateTime.format(StartDate, 'MMMM Do YYYY, h:mm a') : t('noDateFound'), !StartDate, this.nullOutPreviewMode)}
			</div>
		</Flyout.Triggered>);
	}

	renderOptions () {
		return (<div className="course-options">
			<div className="publicly-available-option">{this.renderOption(t('publiclyAvailable'), null, !this.state.isNonPublic, this.onPublicChange)}</div>
			<div className="preview-mode-option"><div className="course-option"><div className="course-option-label">{t('previewMode')}</div>{this.renderPreviewWidget()}</div></div>
			<EnrollmentOptions catalogEntry={this.state.course}/>
		</div>);
	}

	renderOption (label, description, value, onChange) {
		return (<div className="course-option"><div className="course-option-label">{label}</div><Input.Toggle className="control" value={value} onChange={onChange}/></div>);
	}

	onSave = () => {
		const { onFinish } = this.props;
		const { course } = this.state;

		saveCatalogEntry(course, {
			ProviderUniqueID: course.ProviderUniqueID,
			['is_non_public']: this.state.isNonPublic,
			Preview: this.state.previewMode
		}, () => {
			onFinish && onFinish(course);
		});
	};

	onPublicChange = (value) => {
		this.setState({isNonPublic: !value});
	}

	onPreviewChange = (value) => {
		this.flyout && this.flyout.dismiss();

		this.setState({previewMode: value});
	}

	renderContents () {
		return (
			<div className="contents">
				{this.state.course ? this.renderOptions() : (<Loading.Mask/>)}
			</div>
		);
	}

	render () {
		return (
			<div className="publish-course">
				{this.renderHeader()}
				{this.renderContents()}
				{this.renderBottomControls()}
			</div>
		);
	}
}
