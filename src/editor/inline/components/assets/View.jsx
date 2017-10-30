import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';
import {getService} from 'nti-web-client';

const LABELS = {
	label: 'Assets'
};

const t = scoped('components.course.editor.inline.components.assets.view', LABELS);

/**
 * For now, there isn't really an "edit" mode for assets.  This is how we'll
 * currently allow editing, via file upload
 */

export default class AssetsView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'presentation-assets';

	attachRef = x => this.fileInput = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	uploadAssets = (file) => {
		const { catalogEntry } = this.props;

		// TODO: How to save this, maybe build up FormData?  What field to save to?
		if(file && file.name) {
			this.setState({ uploadInProgress: true});

			getService().then(service => {
				const formData = new FormData();
				formData.append(file.name, file);
				service.put(catalogEntry.getLink('edit'), formData);
			}).then(() => {
				this.setState({ uploadInProgress: false, uploadSuccess: true });
				setTimeout(() => { this.setState({ uploadSuccess: undefined}); }, 1500);
			});
		}
	}

	renderInput () {
		const { uploadInProgress, uploadSuccess } = this.state;

		if(uploadInProgress) {
			return (<div>Uploading...</div>);
		}

		if(uploadSuccess) {
			return (<div className="upload-success">Upload successful</div>);
		}

		return (<Input.File className="asset-file" accept=".zip" ref={this.attachRef} onFileChange={this.uploadAssets}/>);
	}

	render () {
		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">
					{this.renderInput()}
				</div>
			</div>
		);
	}
}
