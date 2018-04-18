import React from 'react';
import {ImageEditor} from '@nti/web-whiteboard';

export default function ImageEditorWrapper (props) {
	return (
		<div className="course-asset-editor-image-editor-wrapper">
			<ImageEditor.Editor {...props} />
		</div>
	);
}
