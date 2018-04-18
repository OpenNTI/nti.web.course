import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from '@nti/web-whiteboard';
import {scoped} from '@nti/lib-locale';

import Header from '../Header';
import Footer from '../Footer';
import ImageEditorWrapper from '../ImageEditorWrapper';

import Size from './Size';


const t = scoped('course.info.inline.assets.course-asset-editor.AssetsPicker', {
	icon: 'icon',
	promo: 'promo',
	cover: 'cover',
	background: 'background',
	title: 'Preview & Adjust Each Size',
	subTitle: 'Upload a New Course Image',
	apply: 'Apply Image',
	cancel: 'Cancel'
});

const getSizes = () => {
	return [
		{
			name: t('icon'),
			id: 'icon',
			formatting: { crop: { aspectRatio: 1} },
			fileName: 'catalog-entry-thumbnail'
		},
		{
			name: t('promo'),
			id: 'promo',
			formatting: { crop: { aspectRatio: 16 / 9} },
			fileName: 'catalog-promo-large'
		},
		{
			name: t('cover'),
			id: 'cover',
			formatting: { crop: { aspectRatio: 232 / 170} },
			fileName: 'catalog-entry-cover',
		},
		{
			name: t('background'),
			id: 'background',
			formatting: { crop: { aspectRatio: 3 / 2 }, blur: { radius: 50 } },
			fileName: 'catalog-background'
		}
	];
};

export default class AssetsPicker extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,

		onSave: PropTypes.func,
		onCancel: PropTypes.func,
		onBack: PropTypes.func
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
			activeSizeID: null //set it to null for a beat to clear it out
		}, () => {
			this.setState({
				activeSizeID
			});
		});
	}


	onSave = async () => {
		const {asset, onSave, baseAsset} = this.props;
		const {sizes} = this.state;

		try {
			const images = await Promise.all(
				sizes.map(async (size) => {
					const editorState = ImageEditor.getEditorState(asset, size.formatting);

					const blob = await ImageEditor.getBlobForEditorState(editorState);

					return {blob, fileName: size.fileName};
				})
			);
			const baseBlob = await ImageEditor.getBlobForEditorState(ImageEditor.getEditorState(baseAsset, {}));


			onSave([...images, {fileName: 'catalog-source', blob: baseBlob}]);
		} catch (e) {
			//TODO: handle error
		}
	}


	onBack = () => {
		const {onBack} = this.props;

		if (onBack) {
			onBack();
		}
	}


	onCancel = () => {
		const {onCancel} = this.props;

		if (onCancel) {
			onCancel();
		}
	}


	onActiveSizeChange = (editorState) => {
		const {sizes, activeSizeID} = this.state;

		this.setState({
			sizes: sizes.map((size) => {
				if (size.id === activeSizeID) {
					return {
						...size,
						formatting: editorState.formatting
					};
				}

				return size;
			})
		});
	}


	render () {
		return (
			<div className="course-info-asset-picker">
				<Header
					title={t('title')}
					subTitle={t('subTitle')}
					onCancel={this.onCancel}
					onBack={this.onBack}
				/>
				{this.renderSizes()}
				{this.renderEditor()}
				<Footer
					continueLabel={t('apply')}
					cancelLabel={t('cancel')}
					onContinue={this.onSave}
					onCancel={this.onCancel}
				/>
			</div>
		);
	}


	renderSizes () {
		const {asset} = this.props;
		const {activeSizeID, sizes} = this.state;

		return (
			<div className="sizes">
				{sizes.map((size, index) => {
					return (
						<Size
							key={index}
							asset={asset}
							formatting={size.formatting}
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
		const editorState = activeSize && ImageEditor.getEditorState(asset, activeSize.formatting);

		return editorState ? (<ImageEditorWrapper editorState={editorState} onChange={this.onActiveSizeChange}/>) : null;
	}
}
