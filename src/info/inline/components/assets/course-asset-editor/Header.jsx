import React from 'react';
import PropTypes from 'prop-types';

export default class CourseAssetEditorHeader extends React.Component {
	static propTypes = {
		onBack: PropTypes.func,
		title: PropTypes.string,
		subTitle: PropTypes.string,
		onCancel: PropTypes.func
	}


	onBack = () => {
		const {onBack} = this.props;

		if (onBack) {
			onBack();
		}
	}


	onCancel = () => {
		const {onCancel} = this.props;

		if (onCancel) {
			onCancel();
		}
	}


	render () {
		const {title, subTitle, onBack, onCancel} = this.props;

		return (
			<div className="course-asset-editor-header">
				{onBack && (<i className="icon-chevronup-25" onClick={this.onBack} />)}
				<div className="meta">
					{subTitle && (<span className="sub-title">{subTitle}</span>)}
					{title && (<span className="title">{title}</span>)}
				</div>
				{onCancel && (<i className="icon-light-x" onClick={this.onCancel} />)}
			</div>
		);
	}
}
