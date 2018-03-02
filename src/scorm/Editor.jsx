import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Prompt, Input, Button, Panels } from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';
import { getService } from 'nti-web-client';

const { Dialog } = Prompt;
const { Header } = Panels;

const LABELS = {
	cancel: 'Cancel',
	import: 'Import',
	importFile: 'Import New Scorm Package',
	missingInputs: 'Must provide a scorm package',
	title: 'Drag a Scorm Package, or',
	choose: 'Choose a File',
	requirements: 'Must be a scorm package under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.',

};

const t = scoped('components.course.editor.scorm-import.wizardpanel', LABELS);

class Editor extends Component {
	static propTypes = {
		onDismiss: PropTypes.func.isRequired,
		importLink: PropTypes.string.isRequired
	}

	state = { file: null, error: '' }


	onError = (error) => {
		this.setState({ error });
	}

	updateImportFile = file => {
		this.setState({ file, error: '' });
	}

	onSave = async (done) => {
		const { file } = this.state;

		if (!file) {
			this.setState({ error: t('missingInputs') });

			return;
		}

		try {
			const { importLink, onDismiss } = this.props;
			const service = await getService();

			const formData = new FormData();
			formData.append(file.name, file);

			service.post(importLink, formData)
				.then(() => {
					this.setState({ error: '' });

					onDismiss();
					done();
				});
		} catch (error) {
			this.setState({ error: t('unknownError') });
		}
	};

	render () {
		const { onDismiss } = this.props;
		const { error } = this.state;

		return(
			<Dialog>
				<Fragment>
					<Header onClose={onDismiss}>
						<div className="scorm-header">
							Import a Scorm Package
						</div>
					</Header>
					<div className="scorm-editor">
						{error && <div className="scorm-import-error">{error}</div>}
						<div className="scorm-editor-import">
							<div className="import-file">
								<Input.FileDrop getString={t} placeholder={t('importFile')} accept=".zip" onChange={this.updateImportFile} onError={this.onError} />
							</div>
						</div>
						<div className="scorm-editor-controls">
							<div className="scorm-editor-cancel" onClick={onDismiss}>{t('cancel')}</div>
							<Button className="scorm-editor-save" onClick={this.onSave}>{t('import')}</Button>
						</div>
					</div>
				</Fragment>
			</Dialog>
		);
	}
}

export default Editor;
