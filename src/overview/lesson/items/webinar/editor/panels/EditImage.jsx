import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, DialogButtons} from '@nti/web-commons';
import {ImageEditor} from '@nti/web-whiteboard';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.EditImage', {
	cancel: 'Cancel',
	save: 'Save'
});

export default class EditImage extends React.Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onDismiss: PropTypes.func,
		onSave: PropTypes.func,
		onCancel: PropTypes.func
	}

	state = {}

	static show (editorState) {
		return new Promise((fulfill, reject) => {
			Prompt.modal(
				<EditImage
					editorState={editorState}
					onSave={fulfill}
					onCancel={reject}
				/>,
				'webinar-overview-edit-image'
			);
		});
	}

	componentDidMount () {
		this.setState({editorState: this.props.editorState});
	}

	onImageCrop = async (editorState) => {
		this.setState({editorState});
	}

	onSave = async () => {
		const {onDismiss} = this.props;

		if(onDismiss) {
			onDismiss();
		}

		const img = await ImageEditor.getImageForEditorState(this.state.editorState);

		return this.props.onSave(img);
	}

	onCancel = () => {
		const {onDismiss} = this.props;

		if(onDismiss) {
			onDismiss();
		}

		return this.props.onCancel();
	}


	render () {
		if(!this.state.editorState) {
			return null;
		}

		return (
			<div className="webinar-edit-image">
				<ImageEditor.Editor editorState={this.state.editorState} onChange={this.onImageCrop}/>
				<DialogButtons
					buttons={[
						{
							label: t('cancel'),
							onClick: this.onCancel,
						},
						{
							label: t('save'),
							onClick: this.onSave
						}
					]}
				/>
			</div>
		);
	}
}
