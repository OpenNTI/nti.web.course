import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import { Input, Prompt } from 'nti-web-commons';
import { getService } from 'nti-web-client';

import { Upload } from './tasks';

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
	unknownError: 'Unable to upload file.',
	courseSuccessfullyImported: 'Scorm package successfully uploaded',
	importSuccess: 'Upload Success'
};

const NUM_CHECKS = 10;
const TRANSFER_PCT = 25.0;
const REMAINING_PCT = 100.0 - TRANSFER_PCT;
const PROGRESS_TICK = 1000;

const t = scoped('components.course.editor.scorm-import.wizardpanel', LABELS);

const handleError = (error) => {
	if (!error) { return t('unknownError'); }

	try {
		const parsedError = JSON.parse((error && error.responseText) || error);
		return parsedError.message || t('unknownError');
	} 
	catch (e) {
		return t('unknownError');
	}
};

export default class ScormImport extends React.Component {
	static tabName = 'Import Scorm'
	static tabDescription = 'Import Scorm Package'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		buttonLabel: PropTypes.string,
		exitProgressState: PropTypes.func,
		type: PropTypes.string,
		catalogEntry: PropTypes.object,
		bundle: PropTypes.object
	}

	static defaultProps = {
		type: 'ImportSCORM'
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


	onComplete = (response) => {
		this.setState({completed: true});
	}

	onFailure = (error) => {
		const { createdEntry } = this.state;

		if(createdEntry) {
			createdEntry.delete().then(() => {
				this.setState({error: handleError(error), saveDisabled: true});
			}).catch(() => {
				this.setState({error: t('unknownError'), saveDisabled: true});
			});
		}
		else {
			this.setState({error: handleError(error), saveDisabled: true});
		}
	}

	onProgress = (e) => {
		this.setState({
			pctComplete: TRANSFER_PCT * (e.loaded / (e.total || 1)),
			uploadDone: e.loaded === e.total
		});
	}


	checkProgress = (done) => {
		const { completed, error, uploadDone } = this.state;

		if(error) {
			clearInterval(this.progressChecker);

			this.setState({loading: false});

			const {exitProgressState} = this.props;

			exitProgressState && exitProgressState();
		}

		if(uploadDone) {
			this.checkCounter++;

			if(this.checkCounter >= NUM_CHECKS) {
				clearInterval(this.progressChecker);

				const { afterSave } = this.props;

				if(completed) {
					// close this modal and show success message
					this.props.onCancel(true);

					Prompt.alert(t('courseSuccessfullyImported'), t('importSuccess'));
				}
				else {
					// show 'taking longer than expected' message
					afterSave && afterSave();

					done();
				}
			}
			else {
				const newPct = TRANSFER_PCT + (REMAINING_PCT * this.checkCounter / NUM_CHECKS);

				this.setState({pctComplete : newPct});
			}
		}
	}


	onSave = async (done) => {
		const { file } = this.state;

		if(!file) {
			this.setState({ error: t('missingInputs')});

			return;
		}

		try {
			const { catalogEntry, type, bundle } = this.props;
			const service = await getService();
			const courseInstance = bundle || await service.getObject(catalogEntry && catalogEntry.CourseNTIID);
			const link = courseInstance.getLink(type);

			this.setState({loading: true, completed: false, saveDisabled: false, error: null, pctComplete: 0});

			const {enterProgressState} = this.props;

			enterProgressState && enterProgressState();

			this.checkCounter = 0;

			Upload(link, file, this.onComplete, this.onFailure, this.onProgress);

			this.progressChecker = setInterval(() => { this.checkProgress(done); }, PROGRESS_TICK);
		} catch (error) {
			this.setState({ error: t('unknownError') });
		}
	}


	renderProgress () {
		const { pctComplete } = this.state;

		return (
			<div className="progress">
				<div className="bar">
					<div className="indicator" style={{width: `${pctComplete}%`}} />
				</div>
			</div>
		);
	}


	renderFileForm () {
		const {file} = this.state;

		return (
			<div className="import-file">
				<Input.FileDrop getString={t} placeholder={t('importFile')} value={file} accept=".zip" onChange={this.updateImportFile} onError={this.onError} />
			</div>
		);
	}


	renderBody () {
		const { loading } = this.state;

		return (<div className="course-panel-getstarted-form">
			{loading ? this.renderProgress() : this.renderFileForm()}
		</div>);
	}


	render () {
		const { onCancel, buttonLabel, saveCmp: Cmp } = this.props;
		const { error } = this.state;
		return (
			<div className="scorm-import-panel">
				<div className="course-panel-import-content">
					{error && <div className="scorm-import-error">{error}</div>}
					{this.renderBody()}
				</div>
				<div className="course-panel-controls">
					{Cmp && <Cmp onSave={this.onSave} label={buttonLabel}/>}
					{onCancel && <div className="course-panel-cancel" onClick={onCancel}>{t('cancel')}</div>}
				</div>
			</div>
		);
	}
}
