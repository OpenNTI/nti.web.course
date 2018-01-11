import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import { Input } from 'nti-web-commons';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';

const LABELS = {
	defaultTitle: 'Import Course',
	cancel: 'Cancel',
	import: 'Import',
	adminLevel: 'Admin Level',
	importFile: 'Import File',
	missingInputs: 'Must provide an import file'
};

const t = scoped('components.course.editor.import.wizardpanel', LABELS);

export default class CourseImport extends React.Component {
	static tabName = 'Import'
	static tabDescription = 'Import Course'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		buttonLabel: PropTypes.string
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	}

	renderCloseButton () {
		return (<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>);
	}

	renderTitle () {
		return (<div className="course-import-header-title">{t('defaultTitle')}</div>);
	}

	updateImportFile = (file) => {
		this.setState({file});
	}

	renderFileImport () {
		return (<div className="import-file"><Input.File placeholder={t('importFile')} accept=".zip" onFileChange={this.updateImportFile}/></div>);
	}

	renderError () {
		const { error } = this.state;

		return (<div className="course-import-error">{error}</div>);
	}

	renderBody () {
		return (<div className="course-panel-getstarted-form">
			{this.renderFileImport()}
		</div>);
	}

	onSave = async () => {
		const { afterSave } = this.props;
		const { file } = this.state;

		if(!file) {
			this.setState({ error: t('missingInputs')});

			return;
		}

		const data = {
			ProviderUniqueID: file.name.replace('.zip', ''),
			title: '[Import in progress]',
		};

		const service = await getService();
		const catalogEntryFactory = await Models.courses.CatalogEntry.getFactory(service);
		const createdEntry = await catalogEntryFactory.create(data, catalogEntryFactory.IMPORTED_LEVEL_KEY);
		await createdEntry.save(data);

		const importLink = createdEntry.getLink('Import');
		const formData = new FormData();

		formData.append('writeout', true);
		formData.append(file.name, file);

		service.post(importLink, formData); // don't wait on this, could take a while

		this.setState({ error: null });

		afterSave && afterSave();
	};

	renderSaveCmp () {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if(Cmp) {
			return (<Cmp onSave={this.onSave} label={buttonLabel}/>);
		}

		return null;
	}

	renderCancelCmp () {
		if(this.props.onCancel) {
			return (<div className="course-panel-cancel" onClick={this.props.onCancel}>{t('cancel')}</div>);
		}
	}

	render () {
		return (
			<div className="course-import-panel">
				<div className="course-panel-import-content">
					{this.renderError()}
					{this.renderBody()}
				</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}
