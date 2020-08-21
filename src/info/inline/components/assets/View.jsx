import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import AssetType from './AssetType';
import CourseAssetEditor from './course-asset-editor';


const t = scoped('course.info.inline.components.assets.View', {
	label: 'Assets',
	update: 'Edit'
});

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
		return (
			<div className="assets-preview">
				{this.renderAsset('thumb')}
				{this.renderAsset('promo')}
				{this.renderAsset('landing')}
				{this.renderAsset('background')}
			</div>
		);
	}

	render () {
		return (
			<div className="assets-section">
				<div className="header-section">
					<div className="date-label">{t('label')}</div>
					{this.renderInput()}
				</div>
				<div className="content-row">
					{this.renderPreview()}
				</div>
			</div>
		);
	}
}
