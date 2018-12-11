import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Panels, DialogButtons} from '@nti/web-commons';

import View from './View';

const t = scoped('course.enrollment.admin.Prompt', {
	title: 'Manage Enrollment',
	done: 'Done'
});

export default class CourseEnrollmentAdminPrompt extends React.Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired
	}


	onBeforeDismiss = () => {
		const {onBeforeDismiss} = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}
	}


	render () {
		const props = {...this.props};
		const buttons = [
			{label: t('done'), onClick: this.onBeforeDismiss}
		];

		delete props.onBeforeDismiss;

		return (
			<Prompt.Dialog
				onBeforeDismiss={this.onBeforeDismiss}
				closeOnMaskClick
				closeOneEscape
				restoreScroll
			>
				<div className="nti-course-enrollment-admin-prompt">
					<Panels.TitleBar title={t('title')} iconAction={this.onBeforeDismiss} />
					<div className="contents-container">
						<View {...props} />
					</div>
					<DialogButtons buttons={buttons} />
				</div>
			</Prompt.Dialog>
		);
	}
}
