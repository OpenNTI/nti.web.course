import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, Panels, DialogButtons } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Requirement from './Requirement';

const t = scoped('course.pass-fail.requirement-details', {
	title: 'Course Requirements',
	done: 'Done',
	cancel: 'Cancel',
	assignmentReq: 'ASSIGNMENT NAME',
	message: 'The following items did not meet the requirements to complete this course yet.'
});

const items = [
	{ title: 'The Basics Of Buying A Telescope', score: 80, targetScore: 90, getID () { return '1'; } },
	{ title: 'Astronomy Or Astrology', score: 80, targetScore: 90, getID () { return '2'; } },
	{ title: 'Asteroids', score: 80, targetScore: 90, getID () { return '3'; } },
];

export default class RequirementDetails extends React.Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired
	}

	onBeforeDismiss = () => {
		const { onBeforeDismiss } = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}
	}

	render () {
		const buttons = [
			{ label: t('cancel'), onClick: this.onBeforeDismiss },
			{ label: t('done'), onClick: this.onBeforeDismiss },
		];

		return (
			<Prompt.Dialog
				closeOnMaskClick
			>
				<div className="requirement-details-prompt">
					<Panels.TitleBar title={t('title')} iconAction={this.onBeforeDismiss} />
					<div className="contents-container">
						<div className="req-message">
							{t('message')}
						</div>
						<Requirement title={t('assignmentReq')} items={items} />
					</div>
					<DialogButtons buttons={buttons} />
				</div>
			</Prompt.Dialog>
		);
	}
}
