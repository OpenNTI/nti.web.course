import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from 'nti-web-whiteboard';
import {scoped} from 'nti-lib-locale';

import Header from './Header';
import Footer from './Footer';
import ImageEditorWrapper from './ImageEditorWrapper';


const t = scoped('course.info.inline.asets.course-asset-editor.BaseAssetPicker', {
	continue: 'Continue',
	cancel: 'Cancel'
});

export default class BaseAssetPicker extends React.Component {
	static propTypes = {
		onSave: PropTypes.func,
		onCancel: PropTypes.func
	}

	state = {}


	onImageChange = async (editorState) => {
		const {onSave} = this.props;

		try {
			const img = await ImageEditor.getImageForEditorState(editorState);

			if (img && onSave) {
				onSave(img);
			}
		} catch (e) {
			//handle error
		}
	}


	onCancel = () => {
		const {onCancel} = this.props;

		if (onCancel) {
			onCancel();
		}
	}


	render () {
		return (
			<div className="course-asset-editor-base-asset-picker">
				<Header onCancel={this.onCancel}/>
				<ImageEditorWrapper onChange={this.onImageChange}/>
				<Footer
					continueDisabled
					continueLabel={t('continue')}
					cancelLabel={t('cancel')}
					onCancel={this.onCancel}
				/>
			</div>
		);
	}

}
