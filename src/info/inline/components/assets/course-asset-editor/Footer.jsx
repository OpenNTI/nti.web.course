import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'nti-web-commons';


export default class CourseAssetEditorFooter extends React.Component {
	static propTypes = {
		onContinue: PropTypes.func,
		onCancel: PropTypes.func,
		continueDisabled: PropTypes.bool,
		continueLabel: PropTypes.string,
		cancelLabel: PropTypes.string
	}

	onContinue = () => {
		const {onContinue} = this.props;

		if (onContinue) {
			onContinue();
		}
	}

	onCancel = () => {
		const {onCancel} = this.props;

		if (onCancel) {
			onCancel();
		}
	}

	render () {
		const {continueDisabled, continueLabel, cancelLabel} = this.props;

		return (
			<div className="course-asset-editor-footer">
				<Button className="continue" onClick={this.onContinue} rounded disabled={continueDisabled}>
					{continueLabel}
				</Button>
				<Button className="cancel" onClick={this.onCancel} secondary>
					{cancelLabel}
				</Button>
			</div>
		);
	}
}
