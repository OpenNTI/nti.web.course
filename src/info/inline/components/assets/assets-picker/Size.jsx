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

	state = {}

	componentWillReceiveProps (newProps) {
		const {asset:newAsset, formatting: newFormatting} = newProps;
		const {asset:oldAsset, formatting: oldFormatting} = this.props;

		if (newAsset !== oldAsset || newFormatting !== oldFormatting) {
			this.loadSrcFor(newProps);
		}
	}


	componentDidMount () {
		this.loadSrcFor();
	}


	async loadSrcFor (props = this.props) {
		const {asset, formatting} = props;
		const editorState = ImageEditor.getEditorState(asset, formatting);

		try {
			const img = await ImageEditor.getImageForEditorState(editorState);

			this.setState({
				src: img.src
			});
		} catch (e) {
			//handle error
		}
	}


	onClick = () => {
		const {onSelect, selectID} = this.props;

		if (onSelect) {
			onSelect(selectID);
		}
	}


	render () {
		const {name, active, selectID} = this.props;
		const {src} = this.state;

		return (
			<div className={cx('course-info-asset-picker-size', {active}, selectID)} onClick={this.onClick}>
				<div className="preview">
					{src && <img src={src} style={{width: '100%'}}/>}
				</div>
				<div className="name">{name}</div>
			</div>
		);
	}
}
