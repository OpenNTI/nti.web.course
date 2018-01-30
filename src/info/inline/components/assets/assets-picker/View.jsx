import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from 'nti-web-whiteboard';
import {scoped} from 'nti-lib-locale';

import Size from './Size';

const DEFAULT_TEXT = {
	thumbnail: 'thumbnail',
	promo: 'promo',
	cover: 'cover',
	background: 'background'

};
const t = scoped('nti-web-course.info.inline.assets.AssetsPicker', DEFAULT_TEXT);

const getSizes = () => {
	return [
		{
			name: t('thumbnail'),
			id: 'thumb',
			crop: {aspectRatio: 1}
		},
		{
			name: t('promo'),
			id: 'promo',
			crop: {aspectRatio: 16 / 9}
		},
		{
			name: t('cover'),
			id: 'cover',
			crop: {aspectRatio: 232 / 170}
		},
		{
			name: t('background'),
			id: 'background',
			crop: {aspectRatio: 3 / 2}
		}
	];
};

export default class AssetsPicker extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onSave: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {
			sizes: getSizes(),
			activeSizeID: 'background'
		};
	}


	getActiveSize () {
		const {activeSizeID, sizes} = this.state;

		for (let size of sizes) {
			if (size.id === activeSizeID) {
				return size;
			}
		}
	}


	selectSize = (activeSizeID) => {
		this.setState({
			activeSizeID
		});
	}


	onSave = () => {

	}


	onActiveSizeChange = (editorState) => {
		const {sizes, activeSizeID} = this.state;

		this.setState({
			sizes: sizes.map((size) => {
				if (size.id === activeSizeID) {
					return {
						...size,
						crop: editorState.formatting.crop
					};
				}

				return size;
			})
		});
	}


	render () {
		return (
			<div className="course-info-asset-picker">
				{this.renderSizes()}
				{this.renderEditor()}
			</div>
		);
	}


	renderSizes () {
		const {asset} = this.props;
		const {activeSizeID, sizes} = this.state;

		return (
			<div className="sizes">
				{sizes.map((size, index) => {
					const formatting = {crop: {...size.crop}};

					return (
						<Size
							key={index}
							asset={asset}
							formatting={formatting}
							name={size.name}
							selectID={size.id}
							active={activeSizeID === size.id}
							onSelect={this.selectSize}
						/>
					);
				})}
			</div>
		);
	}


	renderEditor () {
		const {asset} = this.props;
		const activeSize = this.getActiveSize();
		const editorState = ImageEditor.getEditorState(asset, {crop: {...activeSize.crop}});

		return (
			<div className="editor">
				<ImageEditor.Editor editorState={editorState} onChange={this.onActiveSizeChange}/>
			</div>
		);
	}
}

