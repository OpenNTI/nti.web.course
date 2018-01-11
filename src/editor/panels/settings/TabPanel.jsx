import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Input } from 'nti-web-commons';

import {saveCatalogEntry} from '../../../editor/Actions';

const LABELS = {
	publiclyAvailable: 'Publicly Available',
	previewMode: 'Preview Mode'
};

const t = scoped('components.course.editor.panels.settings.tabpanel', LABELS);

export default class CourseSettings extends React.Component {
	static tabName = 'Settings'
	static tabDescription = 'Course Settings'

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
			isNonPublic: props.catalogEntry.is_non_public,
			isPreviewMode: props.catalogEntry.Preview
		};
	}

	onSave = () => {
		const { catalogEntry, afterSave } = this.props;

		saveCatalogEntry(catalogEntry, {
			ProviderUniqueID: catalogEntry.ProviderUniqueID,
			['is_non_public']: this.state.isNonPublic,
			Preview: this.state.isPreviewMode
		}, () => {
			afterSave && afterSave();
		});
	};

	onPublicChange = (value) => {
		this.setState({isNonPublic: !value}, () => {
			this.onSave();
		});
	}

	onPreviewChange = (value) => {
		this.setState({isPreviewMode: value}, () => {
			this.onSave();
		});
	}

	renderOptions () {
		return (<div className="course-options">
			{this.renderOption(t('publiclyAvailable'), null, !this.state.isNonPublic, this.onPublicChange)}
			{this.renderOption(t('previewMode'), null, this.state.isPreviewMode, this.onPreviewChange)}
		</div>);
	}

	renderOption (label, description, value, onChange) {
		return (<div className="course-option"><div className="course-option-label">{label}</div><Input.Toggle value={value} onChange={onChange}/></div>);
	}

	render () {
		return (<div className="course-panel-settings">
			<div className="course-panel-content">
				{this.renderOptions()}
			</div>
		</div>
		);
	}
}
