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
	static propTypes = {
		title: PropTypes.string,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	}

	doImport = () => {

	}

	renderCloseButton () {
		return (<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>);
	}

	renderTitle () {
		return (<div className="course-import-header-title">{this.props.title || t('defaultTitle')}</div>);
	}

	renderHeader () {
		return (<div className="course-import-header">
			{this.renderCloseButton()}
			<div className="header-text">
				{this.renderTitle()}
			</div>
		</div>);
	}

	updateAdminLevel = (value) => {
		this.setState({adminLevel : value});
	}

	updateIDNumber = (value) => {
		this.setState({identifier : value});
	}

	updateImportFile = (file) => {
		this.setState({file});
	}

	renderAdminLevel () {
		return (<Input.Text placeholder={t('adminLevel')} value={this.state.adminLevel} onChange={this.updateAdminLevel}/>);
	}

	renderIDInput () {
		return (<Input.Text placeholder={t('identifier')} value={this.state.identifier} onChange={this.updateIDNumber}/>);
	}

	renderFileImport () {
		return (<div className="import-file"><Input.File placeholder={t('importFile')} onFileChange={this.updateImportFile}/></div>);
	}

	renderBody () {
		return (<div className="course-panel-getstarted-form">
			{this.renderAdminLevel()}
			{this.renderIDInput()}
			{this.renderFileImport()}
		</div>);
	}

	renderFooter () {
		return (
			<div className="footer">
				<div onClick={this.doImport} className="course-import-button">{t('import')}</div>
				<div onClick={this.cancel} className="course-import-cancel">{t('cancel')}</div>
			</div>
		);
	}

	render () {
		return (
			<div className="course-import-panel">
				{this.renderHeader()}
				{this.renderBody()}
				{this.renderFooter()}
			</div>
		);
	}
}
