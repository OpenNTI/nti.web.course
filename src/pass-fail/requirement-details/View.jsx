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
	message: 'The following items have not satisfied the requirements of this course.'
});

export default class RequirementDetails extends React.Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		course: PropTypes.object.isRequired
	}

	state = {
		items: []
	}

	async componentDidMount () {
		const {course} = this.props;

		if (course) {
			const CompletionMetadata = (((course.PreferredAccess || {}).CourseProgress || {}).CompletedItem || {}).CompletionMetadata;

			if(CompletionMetadata && CompletionMetadata.Items) {
				const failedItems = CompletionMetadata.Items.filter(item => !item.Success);

				this.setState({items: failedItems});
			}
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
