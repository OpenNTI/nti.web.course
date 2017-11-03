import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input, Presentation, Prompt} from 'nti-web-commons';
import {getService} from 'nti-web-client';
import cx from 'classnames';

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

	//  No static FIELD_NAME

	attachRef = x => this.fileInput = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	uploadAssets = (file) => {
		const { catalogEntry } = this.props;

		if(file && file.name) {
			this.setState({ uploadInProgress: true});

			getService().then(service => {
				const formData = new FormData();
				formData.append(file.name, file);
				return service.put(catalogEntry.getLink('edit'), formData);
			}).then(() => {
				this.setState({ uploadInProgress: false, uploadSuccess: true });
				setTimeout(() => { this.setState({ uploadSuccess: undefined}); }, 1500);
			}).catch((resp) => {
				this.setState({ uploadInProgress: false, uploadSuccess: false, errorMsg: resp.Message || 'Upload failed' });
				setTimeout(() => { this.setState({ uploadSuccess: undefined, errorMsg: undefined}); }, 1500);
			});
		}
	}

	renderInput () {
		const { uploadInProgress, uploadSuccess, errorMsg } = this.state;

		if(uploadInProgress) {
			return (<div>Uploading...</div>);
		}

		if(errorMsg) {
			return (<div className="error">{errorMsg}</div>);
		}

		if(uploadSuccess) {
			return (<div className="upload-success">Upload successful</div>);
		}

		return (<Input.File className="asset-file" accept=".zip" ref={this.attachRef} onFileChange={this.uploadAssets}/>);
	}

	launchImgDialog = (type) => {
		Prompt.modal(
			<div className="large-asset-preview">
				<Presentation.Asset contentPackage={this.props.catalogEntry} propName="src" type={type}>
					<img/>
				</Presentation.Asset>
			</div>
		);
	}

	renderAsset (type) {
		const className = cx('asset', type);

		const showImg = () => {
			this.launchImgDialog(type);
		};

		return (<div className={className}>
			<div className="asset-label">{type}</div>
			<Presentation.Asset contentPackage={this.props.catalogEntry} propName="src" type={type}>
				<img onClick={showImg}/>
			</Presentation.Asset>
		</div>);
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
