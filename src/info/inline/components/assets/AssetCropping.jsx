import React from 'react';
import PropTypes from 'prop-types';
import {ImageEditor} from 'nti-web-whiteboard';

export default class AssetCropping extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,

		onSave: PropTypes.func,
		onCancel: PropTypes.func
	}


	constructor (props) {
		super(props);

		const {asset} = props;

		this.state = {
			editorState: ImageEditor.getEditorState(asset, {crop: {width: asset.naturalWidth, height: asset.naturalHeight}})
		};
	}


	onChange = (editorState) => {
		this.setState({
			croppedState: editorState
		});
	}


	onSave = async () => {
		const {onSave} = this.props;
		const {croppedState} = this.state;

		try {
			const img = await ImageEditor.getImageForEditorState(croppedState);

			if (img && onSave) {
				onSave(img);
			}
		} catch (e) {
			//Handle error
		}
	}


	render () {
		const {editorState} = this.state;

		return (
			<div>
				<ImageEditor.Editor editorState={editorState} onChange={this.onChange}/>
				<span onClick={this.onSave}>Continue</span>
			</div>
		);
	}
}
