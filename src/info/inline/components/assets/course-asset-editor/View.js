import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, Switch, Loading, Presentation } from '@nti/web-commons';
import { dispatch } from '@nti/lib-dispatcher';

import BaseAssetPicker from './BaseAssetPicker';
import AssetCropping from './AssetCropping';
import AssetsPicker from './assets-picker';
import Uploading from './Uploading';
import { Upload } from './tasks';

export default class CourseAssetEditor extends React.Component {
	static show(catalogEntry) {
		return new Promise((fulfill, reject) => {
			return Prompt.modal(
				<CourseAssetEditor
					catalogEntry={catalogEntry}
					onSave={fulfill}
					onCancel={reject}
				/>,
				'course-asset-editor-prompt'
			);
		});
	}

	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onSave: PropTypes.func,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func,
	};

	state = { active: 'loading' };

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { catalogEntry: newEntry } = this.props;
		const { catalogEntry: oldEntry } = prevProps;

		if (newEntry !== oldEntry) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { catalogEntry } = this.props;
		const sourceAsset = Presentation.getAssetSrc(catalogEntry, 'source');

		this.setState(
			{
				active: 'loading',
			},
			() => {
				const img = new Image();

				img.onload = () => {
					this.setState({
						active: 'crop',
						baseAsset: img,
					});
				};

				img.onerror = () => {
					this.setState({
						active: 'base',
					});
				};

				img.src = sourceAsset;
			}
		);
	}

	onCancel = () => {
		const { onCancel, onDismiss } = this.props;

		if (onCancel) {
			onCancel();
		}

		if (onDismiss) {
			onDismiss();
		}
	};

	onSave = () => {
		const { onSave, onDismiss } = this.props;

		if (onSave) {
			onSave();
		}

		if (onDismiss) {
			onDismiss();
		}
	};

	onBaseAssetSave = baseAsset => {
		this.setState({
			baseAsset,
			active: 'crop',
			error: null,
		});
	};

	onAssetCroppingSave = croppedAsset => {
		this.setState({
			croppedAsset,
			active: 'picker',
		});
	};

	onAssetCroppingBack = () => {
		this.setState({
			croppedAsset: null,
			active: 'base',
		});
	};

	onAssetsPicked = images => {
		const { catalogEntry } = this.props;
		const onProgress = e => {
			this.setState({
				uploadProgress: e,
			});
		};

		this.setState(
			{
				active: 'uploading',
				uploadProgress: null,
				uploadError: null,
				error: null,
			},
			async () => {
				try {
					const resp = await Upload(catalogEntry, images, onProgress);

					await catalogEntry.refresh(JSON.parse(resp));

					dispatch('COURSE_ASSET_UPLOAD', {
						id: catalogEntry.CourseNTIID,
					});

					this.setState({
						uploaded: resp,
					});
				} catch (e) {
					this.setState({
						uploadError: e,
					});
				}
			}
		);
	};

	onPickerBack = () => {
		this.setState({
			active: 'crop',
		});
	};

	onUploadingBack = () => {
		this.setState({
			active: 'picker',
		});
	};

	render() {
		const {
			active,
			baseAsset,
			croppedAsset,
			uploaded,
			uploadProgress,
			uploadError,
		} = this.state;
		const { catalogEntry } = this.props;

		return (
			<Switch.Container active={active} className="course-asset-editor">
				<Switch.Item name="loading" component={Loading.Mask} />
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
					baseAsset={baseAsset}
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
