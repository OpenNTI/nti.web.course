import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Switch} from 'nti-web-commons';

import BaseAssetPicker from './BaseAssetPicker';
import AssetCropping from './AssetCropping';
import AssetsPicker from './assets-picker';
import Uploading from './Uploading';
import {Upload} from './tasks';


export default class CourseAssetEditor extends React.Component {
	static show (catalogEntry) {
		return new Promise((fulfill, reject) => {
			return Prompt.modal(
				<CourseAssetEditor
					catalogEntry={catalogEntry}
					onSave={fulfill}
					onCancel={reject}
				/>
				, 'course-asset-editor-prompt');
		});
	}

	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onSave: PropTypes.func,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func
	}


	state = {active: 'base'}


	onCancel = () => {
		const {onCancel, onDismiss} = this.props;

		if (onCancel) {
			onCancel();
		}

		if (onDismiss) {
			onDismiss();
		}
	}


	onSave = () => {
		const {onSave, onDismiss} = this.props;

		if (onSave) {
			onSave();
		}

		if (onDismiss) {
			onDismiss();
		}
	}

	onBaseAssetSave = (baseAsset) => {
		this.setState({
			baseAsset,
			active: 'crop',
			error: null
		});
	}


	onAssetCroppingSave = (croppedAsset) => {
		this.setState({
			croppedAsset,
			active: 'picker',

		});
	}


	onAssetCroppingBack = () => {
		this.setState({
			croppedAsset: null,
			active: 'base'
		});
	}


	onAssetsPicked = (images) => {
		const {catalogEntry} = this.props;
		const onProgress = (e) => {
			this.setState({
				uploadProgress: e
			});
		};

		this.setState({
			active: 'uploading',
			error: null
		}, async () => {
			try {
				const resp = await Upload(catalogEntry, images, onProgress);

				this.setState({
					uploaded: resp
				});
			} catch (e) {
				this.setState({
					uploadError: e
				});
			}
		});

	}

	onPickerBack = () => {
		this.setState({
			active: 'crop'
		});
	}


	render () {
		const {active, baseAsset, croppedAsset, uploaded, uploadProgress, uploadError} = this.state;
		const {catalogEntry} = this.props;

		return (
			<Switch.Container active={active} className="course-asset-editor">
				<Switch.Item
					name="base"
					component={BaseAssetPicker}
					onCancel={this.onCancel}
					onSave={this.onBaseAssetSave}
					catalogEntry={catalogEntry}
				/>
				<Switch.Item
					name="crop"
					component={AssetCropping}
					onCancel={this.onCancel}
					onSave={this.onAssetCroppingSave}
					onBack={this.onAssetCroppingBack}
					catalogEntry={catalogEntry}
					asset={baseAsset}
				/>
				<Switch.Item
					name="picker"
					component={AssetsPicker}
					onCancel={this.onCancel}
					onSave={this.onAssetsPicked}
					onBack={this.onPickerBack}
					catalogEntry={catalogEntry}
					asset={croppedAsset}
				/>
				<Switch.Item
					name="uploading"
					component={Uploading}
					uploaded={uploaded}
					uploadProgress={uploadProgress}
					uploadError={uploadError}
					onCancel={this.onCancel}
					onSave={this.onSave}
					onBack={this.onUploadingBack}
				/>
			</Switch.Container>
		);
	}
}

