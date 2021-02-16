import './Size.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ImageEditor } from '@nti/web-whiteboard';

export default class AssetPickerSize extends React.Component {
	static propTypes = {
		asset: PropTypes.object.isRequired,
		formatting: PropTypes.object.isRequired,
		editorState: PropTypes.object.isRequired,
		name: PropTypes.string.isRequired,
		active: PropTypes.bool,
		selectID: PropTypes.string,
		onSelect: PropTypes.func,
	};

	state = {};

	componentDidMount() {
		this.loadSrcFor();
	}

	componentDidUpdate(prevProps) {
		const { asset: newAsset, editorState } = this.props;
		const { asset: oldAsset, editorState: oldState } = prevProps;

		if (newAsset !== oldAsset || editorState !== oldState) {
			this.loadSrcFor();
		}
	}

	async loadSrcFor(props = this.props) {
		const { asset, editorState: stateProp, formatting } = props;
		const editorState =
			stateProp || ImageEditor.getEditorState(asset, formatting);

		try {
			const img = await ImageEditor.getImageForEditorState(editorState);

			this.setState({
				src: img.src,
			});
		} catch (e) {
			//handle error
		}
	}

	onClick = () => {
		const { onSelect, selectID } = this.props;

		if (onSelect) {
			onSelect(selectID);
		}
	};

	render() {
		const { name, active, selectID } = this.props;
		const { src } = this.state;

		return (
			<div
				className={cx(
					'course-info-asset-picker-size',
					{ active },
					selectID
				)}
				onClick={this.onClick}
			>
				<div className="preview">{src && <img src={src} />}</div>
				<div className="name">{name}</div>
			</div>
		);
	}
}
