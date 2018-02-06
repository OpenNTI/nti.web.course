import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import AssetType from './AssetType';
import CourseAssetEditor from './course-asset-editor';

const LABELS = {
	label: 'Assets',
	update: 'Edit'
};

const t = scoped('components.course.editor.inline.components.assets.view', LABELS);

/**
 * For now, there isn't really an "edit" mode for assets.  This is how we'll
 * currently allow editing, via file upload
 */

export default class AssetsView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onEndEditing: PropTypes.func
	}

	//  No static FIELD_NAME

	attachRef = x => this.fileInput = x

	state = {}

	launch = () => {
		CourseAssetEditor.show(this.props.catalogEntry).then(() => {
			const { onEndEditing } = this.props;

			onEndEditing && onEndEditing(this.props.catalogEntry);
		}).catch(() => {
			const { onEndEditing } = this.props;

			onEndEditing && onEndEditing();
		});
	}

	renderInput () {
		return (<div className="add-course-assets-button" onClick={this.launch}>{t('update')}</div>);
	}

	renderAsset (type) {
		return (<AssetType catalogEntry={this.props.catalogEntry} type={type}/>);
	}

	renderPreview () {
		const { catalogEntry } = this.props;

		if(catalogEntry.PlatformPresentationResources) {
			return (
				<div className="assets-preview">
					{this.renderAsset('thumb')}
					{this.renderAsset('landing')}
					{this.renderAsset('background')}
				</div>
			);
		}
	}

	render () {
		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">
					{this.renderInput()}
					{this.renderPreview()}
				</div>
			</div>
		);
	}
}
