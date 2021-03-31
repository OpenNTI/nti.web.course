import './BaseAssetPicker.scss';
import React from 'react';
import PropTypes from 'prop-types';

import {Text} from '@nti/web-commons';
import { ImageEditor } from '@nti/web-whiteboard';
import { scoped } from '@nti/lib-locale';

import Header from './Header';
import Footer from './Footer';
import ImageEditorWrapper from './ImageEditorWrapper';

const t = scoped(
	'course.info.inline.asets.course-asset-editor.BaseAssetPicker',
	{
		continue: 'Continue',
		cancel: 'Cancel',
		disclaimer: 'We recommend choosing an image that will work well in both landscape and portraits crop ratios.'
	}
);

const Disclaimer = styled(Text.Base).attrs({as: 'div'})`
	font-size: 0.875rem;
	color: var(--secondary-grey);
	text-align: center;
	margin: 2rem 0;
`;

export default class BaseAssetPicker extends React.Component {
	static propTypes = {
		onSave: PropTypes.func,
		onCancel: PropTypes.func,
	};

	state = {};

	onImageChange = async editorState => {
		const { onSave } = this.props;

		try {
			const img = await ImageEditor.getImageForEditorState(editorState);

			if (img && onSave) {
				onSave(img);
			}
		} catch (e) {
			//handle error
		}
	};

	onCancel = () => {
		const { onCancel } = this.props;

		if (onCancel) {
			onCancel();
		}
	};

	render() {
		return (
			<div className="course-asset-editor-base-asset-picker">
				<Header onCancel={this.onCancel} />
				<ImageEditorWrapper onChange={this.onImageChange} />
				<Disclaimer>{t('disclaimer')}</Disclaimer>
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
