import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	defaultTitle: 'Import Course',
	cancel: 'Cancel',
	import: 'Import'
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

	renderBody () {
		return (<div className="course-import-content"/>);
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
