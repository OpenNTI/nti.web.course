import React from 'react';
import PropTypes from 'prop-types';
import { ImageEditor } from '@nti/web-whiteboard';
import { scoped } from '@nti/lib-locale';

import Header from './Header';
import Footer from './Footer';
import ImageEditorWrapper from './ImageEditorWrapper';

const t = scoped(
	'course.info.inline.assets.course-asset-editor.AssetCropping',
	{
		title: 'Crop Your Image',
		subTitle: 'Upload a New Course Image',
		continue: 'Continue',
		cancel: 'Cancel',
	}
);

export default class AssetCropping extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,

		onSave: PropTypes.func,
		onCancel: PropTypes.func,
		onBack: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const { asset } = props;

		this.state = {
			editorState: ImageEditor.getEditorState(asset, {
				crop: {
					width: asset.naturalWidth,
					height: asset.naturalHeight,
				},
			}),
		};
	}

	onChange = editorState => {
		this.setState({
			croppedState: editorState,
		});
	};

	onContinue = async () => {
		const { onSave } = this.props;
		const { croppedState } = this.state;

		try {
			const img = await ImageEditor.getImageForEditorState(croppedState);

			if (img && onSave) {
				onSave(img);
			}
		} catch (e) {
			//Handle error
		}
	};

	onCancel = () => {
		const { onCancel } = this.props;

		if (onCancel) {
			onCancel();
		}
	};

	onBack = () => {
		const { onBack } = this.props;

		if (onBack) {
			onBack();
		}
	};

	render() {
		const { editorState } = this.state;

		return (
			<div>
				<Header
					onBack={this.onBack}
					onCancel={this.onCancel}
					title={t('title')}
					subTitle={t('subTitle')}
				/>
				<ImageEditorWrapper
					editorState={editorState}
					onChange={this.onChange}
				/>
				<Footer
					continueLabel={t('continue')}
					cancelLabel={t('cancel')}
					onContinue={this.onContinue}
					onCancel={this.onCancel}
				/>
			</div>
		);
	}
}
