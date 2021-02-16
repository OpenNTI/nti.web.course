import './Header.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class CourseAssetEditorHeader extends React.Component {
	static propTypes = {
		onBack: PropTypes.func,
		title: PropTypes.string,
		subTitle: PropTypes.string,
		onCancel: PropTypes.func,
		backDisabled: PropTypes.bool,
		cancelDisabled: PropTypes.bool,
	};

	onBack = () => {
		const { onBack } = this.props;

		if (onBack) {
			onBack();
		}
	};

	onCancel = () => {
		const { onCancel } = this.props;

		if (onCancel) {
			onCancel();
		}
	};

	render() {
		const {
			title,
			subTitle,
			onBack,
			onCancel,
			backDisabled,
			cancelDisabled,
		} = this.props;

		return (
			<div className="course-asset-editor-header">
				{onBack && (
					<i
						className={cx('icon-chevronup-25', {
							disabled: backDisabled,
						})}
						onClick={this.onBack}
					/>
				)}
				<div className="meta">
					{subTitle && (
						<span
							className={cx('sub-title', {
								disabled: backDisabled,
								'sub-back': onBack,
							})}
							onClick={onBack && this.onBack}
						>
							{subTitle}
						</span>
					)}
					{title && <span className="title">{title}</span>}
				</div>
				{onCancel && (
					<i
						className={cx('icon-light-x', {
							disabled: cancelDisabled,
						})}
						onClick={this.onCancel}
					/>
				)}
			</div>
		);
	}
}
