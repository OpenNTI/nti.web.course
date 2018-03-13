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
	requirements: 'Must be a scorm package in zip format.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.',
	courseSuccessfullyImported: 'Scorm package successfully uploaded',
	importSuccess: 'Upload Success',
	importPermissionError: 'You do not have permission to upload a Scorm package'
};

const TRANSFER_PCT = 25.0;

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
		enterProgressState: PropTypes.func,
		exitProgressState: PropTypes.func,
		type: PropTypes.string,
		catalogEntry: PropTypes.object,
		bundle: PropTypes.object,
		onFinish: PropTypes.func
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


	onComplete = (newBundle) => {
		this.setState({ completed: true, newBundle });
		this.checkStatus();
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

		this.checkStatus();
	}


	onProgress = (e) => {
		this.setState({
			pctComplete: TRANSFER_PCT * (e.loaded / (e.total || 1)),
			uploadDone: e.loaded === e.total
		});
	}


	checkStatus = () => {
		const { completed, error, uploadDone, newBundle } = this.state;
		const { onFinish } = this.props;

		if(error) {
			clearInterval(this.progressChecker);

			this.setState({loading: false});

			const {exitProgressState} = this.props;

			if (exitProgressState) {
				exitProgressState();
			}
		}

		if(uploadDone && completed) {
			// close this modal and show success message
			if (onFinish) {
				onFinish(newBundle);
			}

			Prompt.alert(t('courseSuccessfullyImported'), t('importSuccess'), { promptType: 'info' });
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

			if(!link) {
				this.setState({error: t('importPermissionError')});
				return;
			}

			this.setState({loading: true, completed: false, saveDisabled: false, error: null, pctComplete: 0});

			const {enterProgressState} = this.props;

			if (enterProgressState) {
				enterProgressState();
			}

			const onComplete = (newBundle) => {
				this.onComplete(newBundle);
				done();
			};

			Upload(link, file, onComplete, this.onFailure, this.onProgress, type);
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

		return (
			<div className="course-panel-getstarted-form">
				{loading ? this.renderProgress() : this.renderFileForm()}
			</div>
		);
	}


	renderSaveCmp () {
		const { buttonLabel, saveCmp: Cmp } = this.props;
		const { loading, saveDisabled } = this.state;

		// TODO: if error, disable until file change?
		if(saveDisabled) {
			return null;
		}


		if(Cmp && !loading) {
			return (<Cmp onSave={this.onSave} label={buttonLabel}/>);
		}

		return null;
	}


	renderCancelCmp () {
		const { loading } = this.state;

		if(this.props.onCancel && !loading) {
			return (<div className="course-panel-cancel" onClick={this.props.onCancel}>{t('cancel')}</div>);
		}
	}



	render () {
		const { error } = this.state;
		return (
			<div className="scorm-import-panel">
				<div className="course-panel-import-content">
					{error && <div className="scorm-import-error">{error}</div>}
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
