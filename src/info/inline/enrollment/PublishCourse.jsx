import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Loading, Prompt, Flyout, DateTime, Input, Text} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import {saveCatalogEntry} from '../../../editor/Actions';

import EnrollmentOptions from './EnrollmentOptions';
import Store from './EnrollmentOptionsStore';


const t = scoped('course.components.PublishCourse', {
	ready: 'Ready to Launch?',
	headerSubText: 'That\'s exciting!  Review a couple settings before the big moment.',
	cancel: 'Cancel',
	done: 'Done',
	discoverable: {
		title: 'Discoverable in Catalog',
		description: 'Learners will be able to find and enroll in courses that are discoverable in the catalog.',
		draft: 'Draft courses default to OFF but can be switched to ON to allow pre-launch enrollment.',
		invite: 'Select OFF for private or invitation-only enrollment.'
	},
	status: {
		title: 'Course Status',
		description: 'Draft courses are invisible to learners&mdash;which is great for planning out your content. <b>Make sure to publish your course when you\'re ready to launch!</b>'
	},
	publiclyAvailable: 'Visible in Catalog',
	previewMode: 'Preview Mode',
	nullPreview: 'Publish on Start Date',
	previewOn: 'Draft',
	previewOnDesc: 'Content is not visible to learners',
	previewOff: 'Published',
	previewOffDesc: 'Content is available to learners',
	noDateFound: 'No start date found',
	general: 'General',
	enrollment: 'Enrollment'
});

const GENERAL = 'general-tab';
const ENROLLMENT = 'enrollment-tab';

export default class PublishCourse extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),
		instance: PropTypes.object,
		onFinish: PropTypes.func,
		onCancel: PropTypes.func
	}

	static show (catalogEntry, instance) {
		let dialog = null;

		return new Promise((fulfill, reject) => {
			dialog = Prompt.modal(
				<PublishCourse onFinish={fulfill} onCancel={reject} catalogEntry={catalogEntry} instance={instance}/>,
				{className: 'publish-course-modal-container'}
			);
		}).then((savedEntry) => {
			dialog && dialog.dismiss();

			return savedEntry;
		}).catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
	}

	constructor (props) {
		super(props);
		this.state = {};

		const { catalogEntry, instance } = props;

		if(typeof catalogEntry === 'string') {
			this.loadCourse();
		}
		else {
			this.state = {
				catalogEntry,
				courseInstance: instance,
				isNonPublic: catalogEntry.isHidden,
				previewMode: catalogEntry.PreviewRawValue,
				activeTab: GENERAL
			};
		}

		this.optionsStore = Store.getStore();
	}

	attachFlyoutRef = x => this.flyout = x


	async loadCourse () {
		const { catalogEntry } = this.props;

		const service = await getService();
		const courseObject = await service.getObject(catalogEntry);

		const catalogEntryObj = courseObject.CatalogEntry || courseObject; // will handle CatalogEntry IDs and CourseInstance IDs as course prop

		this.setState({
			catalogEntry: catalogEntryObj,
			courseInstance: courseObject,
			isNonPublic: catalogEntryObj.isHidden,
			previewMode: catalogEntryObj.PreviewRawValue,
			activeTab: this.state.activeTab || GENERAL
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
		const { onFinish } = this.props;
		const { catalogEntry } = this.state;

		onFinish && onFinish(catalogEntry);
	}

	renderBottomControls () {
		if(!this.state.catalogEntry) {
			return null;
		}

		return (
			<div className="bottom-controls">
				<div className="buttons">
					<div className="publish" onClick={this.cancel}>{t('done')}</div>
				</div>
			</div>
		);
	}

	renderPreviewLabel () {
		const { previewMode } = this.state;

		let previewRenderer = () => this.renderPublishOption();

		if (previewMode === null) { previewRenderer = () => this.renderPublishOnDateOption(); }
		if (previewMode) { previewRenderer = () => this.renderDraftOption(); }

		return (
			<div className="preview-mode-label control">
				<div className="content">
					{previewRenderer()}
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

	renderDraftOption (onClick) {
		const selected = Boolean(this.state.previewMode);

		return (
			<div className={cx('course-preview-option preview-mode-none draft-option', {selected})} onClick={onClick}>
				<Text.Base as="div" className="course-preview-option-label">{t('previewOn')}</Text.Base>
				<Text.Base as="div" className="course-preview-option-info">{t('previewOnDesc')}</Text.Base>
			</div>
		);
	}

	renderPublishOption (onClick) {
		const selected = this.state.previewMode === false;

		return (
			<div className={cx('course-preview-option preview-mode-none  publish-option', {selected})} onClick={onClick}>
				<Text.Base as="div" className="course-preview-option-label">{t('previewOff')}</Text.Base>
				<Text.Base as="div" className="course-preview-option-info">{t('previewOffDesc')}</Text.Base>
			</div>
		);
	}

	renderPublishOnDateOption (onClick) {
		const selected = this.state.previewMode === null;
		const startDate = this.state.catalogEntry?.getStartDate?.();

		return (
			<div className={cx('course-preview-option preview-mode-none  publish-on-date-option', {selected, 'no-date': !startDate})} onClick={onClick}>
				<Text.Base as="div" className="course-preview-option-label">{t('nullPreview')}</Text.Base>
				<Text.Base as="div" className="course-preview-option-info">
					{startDate ? DateTime.format(startDate, 'MMMM Do YYYY, h:mm a') : t('noDateFound')}
				</Text.Base>
			</div>
		);
	}


	renderPreviewOption (label, info, warning, visible, onClick) {
		const className = cx('preview-date-info', { warning, visible });

		return (
			<div className="preview-option preview-mode-none" onClick={onClick}>
				<div>{label}</div>
				<div className={className}>{info}</div>
			</div>
		);
	}


	renderPreviewWidget () {
		return (
			<Flyout.Triggered
				className="preview-mode-widget"
				trigger={this.renderPreviewLabel()}
				ref={this.attachFlyoutRef}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			>
				<div>
					{this.renderDraftOption(this.enablePreviewMode)}
					{this.renderPublishOption(this.disablePreviewMode)}
					{this.renderPublishOnDateOption(this.nullOutPreviewMode)}
				</div>
			</Flyout.Triggered>
		);
	}

	renderGeneralOptions () {
		if(!this.state.catalogEntry) {
			return <Loading.Mask/>;
		}

		return (
			<div className="course-options">
				<div className="publicly-available-option course-option">
					<div className="course-option-info">
						<Text.Base localized as="div" className="course-option-label">{t('discoverable.title')}</Text.Base>
						<Text.Base localized as="div" className="course-option-description">{t('discoverable.description')}</Text.Base>
						<ul className="course-option-disclaimer">
							<Text.Base localized as="li">{t('discoverable.draft')}</Text.Base>
							<Text.Base localized as="li">{t('discoverable.invite')}</Text.Base>
						</ul>
					</div>
					<div className="course-option-control">
						<Input.Toggle className="control" value={!this.state.isNonPublic} onChange={this.onPublicChange} />
					</div>
				</div>
				<div className="preview-mode-option course-option">
					<div className="course-option-info">
						<Text.Base localized as="div" className="course-option-label">{t('status.title')}</Text.Base>
						<Text.Base localized as="div" className="course-option-description">{t('status.description')}</Text.Base>
					</div>
					<div className="course-option-control">
						{this.renderPreviewWidget()}
					</div>
				</div>
			</div>
		);
	}

	renderEnrollmentOptions () {
		if(!this.state.catalogEntry) {
			return <Loading.Mask/>;
		}

		return <EnrollmentOptions catalogEntry={this.state.catalogEntry} courseInstance={this.state.courseInstance}/>;
	}

	renderOption (label, description, value, onChange) {
		return (<div className="course-option"><div className="course-option-label">{label}</div><Input.Toggle className="control" value={value} onChange={onChange}/></div>);
	}

	onSave = () => {
		const { onFinish } = this.props;
		const { catalogEntry } = this.state;

		saveCatalogEntry(catalogEntry, {
			ProviderUniqueID: catalogEntry.ProviderUniqueID,
			['is_non_public']: this.state.isNonPublic,
			Preview: this.state.previewMode
		}, () => {
			onFinish && onFinish(catalogEntry);
		});
	};

	onPublicChange = (value) => {
		const { catalogEntry } = this.state;

		this.setState({isNonPublic: !value}, () => {
			saveCatalogEntry(catalogEntry, {
				ProviderUniqueID: catalogEntry.ProviderUniqueID,
				['is_non_public']: this.state.isNonPublic
			}, () => {
				if(this.optionsStore) {
					this.optionsStore.updateVisibility();
				}
			});
		});
	}

	onPreviewChange = (value) => {
		const { catalogEntry } = this.state;

		this.flyout && this.flyout.dismiss();

		this.setState({previewMode: value}, () => {
			saveCatalogEntry(catalogEntry, {
				ProviderUniqueID: catalogEntry.ProviderUniqueID,
				Preview: this.state.previewMode
			});
		});
	}

	renderContents () {
		return (
			<div className="contents">
				{this.state.activeTab === GENERAL && this.renderGeneralOptions()}
				{this.state.activeTab === ENROLLMENT && this.renderEnrollmentOptions()}
			</div>
		);
	}

	renderNavItem (name, label) {
		const cls = cx('publish-nav-item', {active: this.state.activeTab === name});

		return <div className={cls} onClick={() => { this.setState({activeTab: name}); }}>{label}</div>;
	}

	renderNavBar () {
		return (
			<div className="publish-nav-bar">
				{this.renderNavItem(GENERAL, t('general'))}
				{this.renderNavItem(ENROLLMENT, t('enrollment'))}
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
