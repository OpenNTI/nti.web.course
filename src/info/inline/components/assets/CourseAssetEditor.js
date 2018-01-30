import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Switch} from 'nti-web-commons';

import BaseAssetPicker from './BaseAssetPicker';
import AssetCropping from './AssetCropping';
import AssetsPicker from './assets-picker';


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
		onCancel: PropTypes.func
	}


	state = {active: 'base'}


	onCancel = () => {

	}

	onBaseAssetSave = (baseAsset) => {
		this.setState({
			baseAsset,
			active: 'crop'
		});
	}


	onAssetCroppingSave = (croppedAsset) => {
		this.setState({
			croppedAsset,
			active: 'picker'
		});
	}


	onAssetsPicked = () => {
	}


	render () {
		const {active, baseAsset, croppedAsset} = this.state;
		const {catalogEntry} = this.props;

		return (
			<Switch.Container active={active}>
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
			</Switch.Container>
		);
	}
}

