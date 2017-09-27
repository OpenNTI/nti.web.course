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
	identifier: 'Identifier',
	adminLevel: 'Admin Level',
	importFile: 'Import File'
};

const t = scoped('COURSE_IMPORT', LABELS);

export default class CourseImport extends React.Component {
	static tabName = 'Import'
	static tabDescription = 'Import Course'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
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

	updateIDNumber = (value) => {
		this.setState({identifier : value});
	}

	updateImportFile = (file) => {
		this.setState({file});
	}

	renderIDInput () {
		return (<Input.Text placeholder={t('identifier')} value={this.state.identifier} onChange={this.updateIDNumber}/>);
	}

	renderFileImport () {
		return (<div className="import-file"><Input.File placeholder={t('importFile')} onFileChange={this.updateImportFile}/></div>);
	}

	renderError () {
		const { error } = this.state;

		if(error) {
			return (<div className="course-import-error">{error}</div>);
		}
	}

	renderBody () {
		return (<div className="course-panel-getstarted-form">
			{this.renderIDInput()}
			{this.renderFileImport()}
		</div>);
	}

	onSave = async (done) => {
		const { afterSave } = this.props;
		const { identifier, file } = this.state;

		if(!file || !identifier) {
			this.setState({ error: 'Must provide an import file and an identifier'});

			done();

			return;
		}

		const data = {
			ProviderUniqueID: identifier,
			title: '[Import in progress]',
		};

		const service = await getService();
		const createdEntry = await Models.courses.CatalogEntry.getFactory(service).create(data);
		await createdEntry.save(data);

		const importLink = createdEntry.getLink('Import');
		const formData = new FormData();

		formData.append(file.name, file);

		service.post(importLink, formData); // don't wait on this, could take a while

		afterSave && afterSave();

		done && done();
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
				{this.renderError()}
				<div className="course-panel-content">
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
