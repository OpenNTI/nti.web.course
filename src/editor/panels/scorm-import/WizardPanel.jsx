import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import { Input } from 'nti-web-commons';
import { getService } from 'nti-web-client';

const LABELS = {
	defaultTitle: 'Import Scorm Package',
	cancel: 'Cancel',
	import: 'Import',
	adminLevel: 'Admin Level',
	importFile: 'Import Scorm Package',
	missingInputs: 'Must provide a scorm package',
	title: 'Drag a Scorm Package, or',
	choose: 'Choose a File',
	requirements: 'Must be a scorm package under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.'
};

const t = scoped('components.course.editor.scorm-import.wizardpanel', LABELS);

export default class ScormImport extends React.Component {
	static tabName = 'Import Scorm'
	static tabDescription = 'Import Scorm Package'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		buttonLabel: PropTypes.string
	}

	state = {
		error: '',
		file: null
	}

	renderTitle () {
		return (<div className="scorm-import-header-title">{t('defaultTitle')}</div>);
	}

	updateImportFile = file => {
		this.setState({ file, error: '' });
	}

	onError = (error) => {
		this.setState({ error });
	}

	onSave = async (done) => {
		const { file } = this.state;

		if(!file) {
			this.setState({ error: t('missingInputs')});

			return;
		}

		try {
			const { catalogEntry, afterSave } = this.props;
			const service = await getService();
			const courseInstance = await service.getObject(catalogEntry && catalogEntry.CourseNTIID);
			const importLink = courseInstance && courseInstance.getLink('ImportSCORM');

			const formData = new FormData();
			formData.append(file.name, file);

			service.post(importLink, formData)
				.then(() => { 
					this.setState({ error: '' });

					afterSave();
					done();
				});
		} catch (error) {
			this.setState({ error: t('unknownError') });
		}
	};

	render () {
		const { onCancel, buttonLabel, saveCmp: Cmp } = this.props;
		const { error } = this.state;
		return (
			<div className="scorm-import-panel">
				<div className="course-panel-import-content">
					{error && <div className="scorm-import-error">{error}</div>}
					<div className="course-panel-getstarted-form">
						<div className="import-file">
							<Input.FileDrop getString={t} placeholder={t('importFile')} accept=".zip" onChange={this.updateImportFile} onError={this.onError} />
						</div>
					</div>
				</div>
				<div className="course-panel-controls">
					{Cmp && <Cmp onSave={this.onSave} label={buttonLabel}/>}
					{onCancel && <div className="course-panel-cancel" onClick={onCancel}>{t('cancel')}</div>}
				</div>
			</div>
		);
	}
}
