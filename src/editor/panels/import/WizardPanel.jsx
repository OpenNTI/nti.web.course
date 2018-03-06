import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import { Input, Prompt } from 'nti-web-commons';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';

import { Upload } from './tasks';

const t = scoped('course.editor.import.WizardPanel',
	{
		defaultTitle: 'Import Course',
		cancel: 'Cancel',
		import: 'Import',
		adminLevel: 'Admin Level',
		importFile: 'Import File',
		missingInputs: 'Must provide an import file',
		courseSuccessfullyImported: 'Course successfully imported',
		importSuccess: 'Import Success',
		unknownError: 'Unknown import error'
	});

const NUM_CHECKS = 10;
const TRANSFER_PCT = 25.0;
const REMAINING_PCT = 100.0 - TRANSFER_PCT;
const PROGRESS_TICK = 400;

export default class ImportWizardPanel extends React.Component {
	static tabName = 'Import'
	static tabDescription = 'Import Course'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		buttonLabel: PropTypes.string,
		enterProgressState: PropTypes.func,
		exitProgressState: PropTypes.func,
		onFinish: PropTypes.func
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
		this.setState({error: null, saveDisabled: false, file});
	}

	renderFileImport () {
		return (<div className="import-file"><Input.File placeholder={t('importFile')} value={this.state.file} accept=".zip" onFileChange={this.updateImportFile}/></div>);
	}

	renderError () {
		const { error, loading } = this.state;

		if(loading) {
			return null;
		}

		return (<div className="course-import-error">{error}</div>);
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

	renderBody () {
		const { loading } = this.state;

		return (<div className="course-panel-getstarted-form">
			{loading ? this.renderProgress() : this.renderFileImport()}
		</div>);
	}

	onComplete = (response) => {
		this.setState({completed: true});
	}

	onFailure = (error) => {
		const { createdEntry } = this.state;

		if(createdEntry) {
			createdEntry.delete().then(() => {
				this.setState({error: JSON.parse(error.responseText).message, saveDisabled: true});
			}).catch(() => {
				this.setState({error: t('unknownError'), saveDisabled: true});
			});
		}
		else {
			this.setState({error: JSON.parse(error.responseText).message, saveDisabled: true});
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
		const { onFinish } = this.props;

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
					onFinish && onFinish(false, this.state.createdEntry);

					Prompt.alert(t('courseSuccessfullyImported'), t('importSuccess'), { promptType: 'info' });
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

		const data = {
			ProviderUniqueID: file.name.replace('.zip', ''),
			title: '[Import in progress]',
		};

		const service = await getService();
		const catalogEntryFactory = await Models.courses.CatalogEntry.getFactory(service);
		const createdEntry = await catalogEntryFactory.create(data, catalogEntryFactory.IMPORTED_LEVEL_KEY);
		await createdEntry.save(data);

		this.setState({loading: true, createdEntry, completed: false, saveDisabled: false, error: null, pctComplete: 0});

		const {enterProgressState} = this.props;

		enterProgressState && enterProgressState();

		this.checkCounter = 0;
		Upload(createdEntry, file, this.onComplete, this.onFailure, this.onProgress);

		this.progressChecker = setInterval(() => { this.checkProgress(done); }, PROGRESS_TICK);
	};

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
