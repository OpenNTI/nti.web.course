import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';

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

	renderBody () {
		return (<div className="course-panel-getstarted-form">
			{this.renderIDInput()}
			{this.renderFileImport()}
		</div>);
	}

	onSave = (done) => {
		const { afterSave } = this.props;

		afterSave && afterSave();

		done();
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
