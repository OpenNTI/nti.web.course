import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Input, Flyout, DateTime } from 'nti-web-commons';
import cx from 'classnames';

import {saveCatalogEntry} from '../../../editor/Actions';

const LABELS = {
	publiclyAvailable: 'Publicly Available',
	previewMode: 'Preview Mode',
	nullPreview: 'Based on start date',
	previewOn: 'On',
	previewOnDesc: 'Course is not visible',
	previewOff: 'Off',
	previewOffDesc: 'Course is visible',
	noDateFound: 'No start date found'
};

const t = scoped('components.course.editor.panels.settings.tabpanel', LABELS);

export default class CourseSettings extends React.Component {
	static tabName = 'Settings'
	static tabDescription = 'Course Settings'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);

		this.state = {
			isNonPublic: props.catalogEntry.is_non_public,
			previewMode: props.catalogEntry.PreviewRawValue
		};
	}

	onSave = () => {
		const { catalogEntry, afterSave } = this.props;

		saveCatalogEntry(catalogEntry, {
			ProviderUniqueID: catalogEntry.ProviderUniqueID,
			['is_non_public']: this.state.isNonPublic,
			Preview: this.state.previewMode
		}, () => {
			afterSave && afterSave();
		});
	};

	onPublicChange = (value) => {
		this.setState({isNonPublic: !value}, () => {
			this.onSave();
		});
	}

	onPreviewChange = (value) => {
		this.flyout && this.flyout.dismiss();

		this.setState({previewMode: value}, () => {
			this.onSave();
		});
	}

	renderPreviewLabel () {
		const { previewMode } = this.state;
		const { StartDate } = this.props.catalogEntry;

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
			<div className="preview-mode-label">
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
		const { StartDate } = this.props.catalogEntry;

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

	renderPreviewWidet () {
		const { catalogEntry } = this.props;
		const { StartDate } = catalogEntry;

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
			<div className="preview-mode-option"><div className="course-option"><div className="course-option-label">{t('previewMode')}</div>{this.renderPreviewWidet()}</div></div>
		</div>);
	}

	renderOption (label, description, value, onChange) {
		return (<div className="course-option"><div className="course-option-label">{label}</div><Input.Toggle value={value} onChange={onChange}/></div>);
	}

	render () {
		return (<div className="course-panel-settings">
			<div className="course-panel-content">
				{this.renderOptions()}
			</div>
		</div>
		);
	}
}
