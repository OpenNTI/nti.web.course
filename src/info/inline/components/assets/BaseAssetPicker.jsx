import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from 'nti-web-whiteboard';


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


	render () {
		return (
			<div>
				<ImageEditor.Editor onChange={this.onImageChange}/>
				<span onClick={this.onSave}>Continue</span>
			</div>
		);
	}

}
