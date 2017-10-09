import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Input } from 'nti-web-commons';

import {saveCatalogEntry} from '../../../editor/Actions';

const LABELS = {
	cancel: 'Cancel',
	courseName: 'Course Name',
	identifier: 'Identification Number (i.e. UCOL-3224)',
	description: 'Description'
};

const t = scoped('components.course.editor.panels.basic.tabpanel', LABELS);

export default class CourseBasic extends React.Component {
	static tabName = 'CourseBasic'
	static tabDescription = 'Basic Information'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string
	}

	constructor (props) {
		super(props);
		this.state = {
			courseName: props.catalogEntry && props.catalogEntry.title,
			identifier: props.catalogEntry && props.catalogEntry.ProviderUniqueID,
			description: props.catalogEntry && props.catalogEntry.description
		};
	}

	onSave = (done) => {
		const { catalogEntry, afterSave } = this.props;

		saveCatalogEntry(catalogEntry, {
			ProviderUniqueID: this.state.identifier,
			title: this.state.courseName,
			identifier: this.state.identifier,
			description: this.state.description
		}, () => {
			afterSave && afterSave();

			done && done();
		});
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

	updateCourseName = (value) => {
		this.setState({courseName : value});
	};

	updateIDNumber = (value) => {
		this.setState({identifier : value});
	};

	updateDescription = (value) => {
		this.setState({description : value});
	};

	render () {
		return (<div className="course-panel-getstarted-form">
			<div className="course-panel-content">
				<Input.Text placeholder={t('courseName')} value={this.state.courseName} onChange={this.updateCourseName}/>
				<Input.Text placeholder={t('identifier')} value={this.state.identifier} onChange={this.updateIDNumber}/>
				<Input.TextArea placeholder={t('description')} className="nti-text-input" value={this.state.description} onChange={this.updateDescription}/>
			</div>
			<div className="course-panel-controls">
				{this.renderSaveCmp()}
				{this.renderCancelCmp()}
			</div>
		</div>
		);
	}
}
