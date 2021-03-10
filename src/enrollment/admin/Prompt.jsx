import './Prompt.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Prompt, Panels, DialogButtons } from '@nti/web-commons';

import View from './View';

const t = scoped('course.enrollment.admin.Prompt', {
	title: 'Manage Enrollment',
	done: 'Done',
});

class CourseEnrollmentPromptTrigger extends React.Component {
	static propTypes = {
		children: PropTypes.node,
	};

	state = {};

	onClick = e => {
		e.stopPropagation();
		e.preventDefault();

		this.setState({
			visible: true,
		});
	};

	onBeforeDismiss = () => {
		this.setState({
			visible: false,
		});
	};

	render() {
		const { children, className, ...otherProps } = this.props;
		const { visible } = this.state;

		return (
			<div
				className={cx(
					'nti-course-enrollment-admin-prompt-trigger',
					className
				)}
				onClick={this.onClick}
			>
				{children}
				{visible && (
					<CourseEnrollmentAdminPrompt
						{...otherProps}
						onBeforeDismiss={this.onBeforeDismiss}
					/>
				)}
			</div>
		);
	}
}

export default class CourseEnrollmentAdminPrompt extends React.Component {
	static Trigger = CourseEnrollmentPromptTrigger;

	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		onChange: PropTypes.func,
	};

	onBeforeDismiss = () => {
		const { onBeforeDismiss, onChange } = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}

		if (onChange && this.changed) {
			onChange();
		}
	};

	onChange = () => {
		this.changed = true;
	};

	render() {
		const props = { ...this.props };
		const buttons = [{ label: t('done'), onClick: this.onBeforeDismiss }];

		delete props.onBeforeDismiss;

		return (
			<Prompt.Dialog
				onBeforeDismiss={this.onBeforeDismiss}
				closeOnMaskClick
				closeOneEscape
				restoreScroll
			>
				<div className="nti-course-enrollment-admin-prompt">
					<Panels.TitleBar
						title={t('title')}
						iconAction={this.onBeforeDismiss}
					/>
					<div className="contents-container">
						<View {...props} onChange={this.onChange} />
					</div>
					<DialogButtons buttons={buttons} />
				</div>
			</Prompt.Dialog>
		);
	}
}
