import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {ImageEditor} from 'nti-web-whiteboard';

export default class AssetPickerSize extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,
		formatting: PropTypes.object.isRequired,
		name: PropTypes.string.isRequired,
		active: PropTypes.bool,
		selectID: PropTypes.string,
		onSelect: PropTypes.func
	}


	onClick = () => {
		const {onSelect, selectID} = this.props;

		if (onSelect) {
			onSelect(selectID);
		}
	}


	render () {
		const {asset, formatting, name, active, selectID} = this.props;
		const editorState = ImageEditor.getEditorState(asset, formatting);

		return (
			<div className={cx('course-info-asset-picker-size', {active}, selectID)} onClick={this.onClick}>
				<div className="preview">
					<ImageEditor.Display editorState={editorState} />
				</div>
				<div className="name">{name}</div>
			</div>
		);
	}
}
