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

export default class RequirementDetails extends React.Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		course: PropTypes.shape({
			getAssignments: PropTypes.func.isRequired
		}).isRequired
	}

	state = {
		items: []
	}

	async componentDidMount () {
		if (this.props.course) {
			const assignments = await this.props.course.getAssignments();
			const summary = await assignments.getStudentSummaryWithHistory();
			const items = summary && summary.items.filter(x => x.grade);

			this.setState({ items });
		}
	}

	onBeforeDismiss = () => {
		const { onBeforeDismiss } = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}
	}

	render () {
		const { items } = this.state;
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
