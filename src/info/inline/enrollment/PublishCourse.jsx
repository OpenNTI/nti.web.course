import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Loading, Prompt, Flyout, DateTime, Input} from '@nti/web-commons';
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
	publiclyAvailable: 'Visible in Catalog',
	previewMode: 'Preview Mode',
	nullPreview: 'Based on start date',
	previewOn: 'On',
	previewOnDesc: 'Course is not visible',
	previewOff: 'Off',
	previewOffDesc: 'Course is visible',
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

	static show (catalogEntry, instance) {
		let dialog = null;

		return new Promise((fulfill, reject) => {
			dialog = Prompt.modal(<PublishCourse onFinish={fulfill} onCancel={reject} catalogEntry={catalogEntry} instance={instance}/>);
		}).then((savedEntry) => {
			dialog && dialog.dismiss();

			return savedEntry;
		}).catch(() => {
			dialog && dialog.dismiss();

			Promise.reject();
		});
	}

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
		const { previewMode, catalogEntry } = this.state;
		const startDate = (catalogEntry || {}).getStartDate && catalogEntry.getStartDate();

		let label = t('previewOff');
		let desc = t('previewOffDesc');
		let warning = false;

		if(previewMode === null) {
			label = t('nullPreview');
			desc = startDate ? DateTime.format(startDate, 'MMMM Do YYYY, h:mm a') : t('noDateFound');

			if(!startDate) {
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
		const { StartDate } = this.state.catalogEntry;

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
		const { catalogEntry } = this.state;
		const startDate = (catalogEntry || {}).getStartDate && catalogEntry.getStartDate();

		return (
			<Flyout.Triggered
				className="preview-mode-widget"
				trigger={this.renderPreviewLabel()}
				ref={this.attachFlyoutRef}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			>
				<div>
					{this.renderPreviewOption(t('previewOn'), t('previewOnDesc'), false, this.enablePreviewMode)}
					{this.renderPreviewOption(t('previewOff'), t('previewOffDesc'), false, this.disablePreviewMode)}
					{this.renderPreviewOption(t('nullPreview'), startDate ? DateTime.format(startDate, 'MMMM Do YYYY, h:mm a') : t('noDateFound'), !startDate, this.nullOutPreviewMode)}
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
				<div className="publicly-available-option">{this.renderOption(t('publiclyAvailable'), null, !this.state.isNonPublic, this.onPublicChange)}</div>
				<div className="preview-mode-option"><div className="course-option"><div className="course-option-label">{t('previewMode')}</div>{this.renderPreviewWidget()}</div></div>
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
				{this.renderNavBar()}
				{this.renderContents()}
				{this.renderBottomControls()}
			</div>
		);
	}
}
