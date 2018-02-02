import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from 'nti-web-whiteboard';
import {scoped} from 'nti-lib-locale';

import Header from './Header';
import Footer from './Footer';
import ImageEditorWrapper from './ImageEditorWrapper';


const DEFAULT_TEXT = {
	continue: 'Continue',
	cancel: 'Cancel'
};
const t = scoped('nti-web-course.info.inline.asets.course-asset-editor.BaseAssetPicker', DEFAULT_TEXT);

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
			<div>
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
