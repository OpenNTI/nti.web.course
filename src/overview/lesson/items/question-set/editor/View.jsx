import React from 'react';
import PropTypes from 'prop-types';
import {Publish} from 'nti-web-commons';

import Footer from './Footer';
import PublishState, {PUBLISH, SCHEDULE, DRAFT} from './Publish';
import Reset from './Reset';
import DueDate from './DueDate';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		onDismiss: PropTypes.func
	}

	state = {}


	constructor (props) {
		super(props);

		const {assignment} = this.props;

		let selectedPublishType = PUBLISH;
		let scheduledDate;
		let dueDate = new Date();

		if(assignment) {
			const availableBeginning = assignment['available_for_submission_beginning'];
			const availableEnding = assignment['available_for_submission_ending'];

			const available = availableBeginning && new Date(availableBeginning);
			const value = Publish.evaluatePublishStateFor({
				isPublished: () => assignment && (assignment.PublicationState != null || (available && available && available < Date.now())),
				getPublishDate: () => assignment && available
			});

			if(value) {
				if(value instanceof Date) {
					selectedPublishType = SCHEDULE;
					scheduledDate = value;
				}
				else {
					selectedPublishType = value.toLowerCase();
				}
			}

			if(availableEnding) {
				dueDate = new Date(availableEnding);
			}
		}

		this.state = {
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked: Boolean(dueDate)
		};
	}


	onPublishChange = (selectedPublishType, scheduledDate) => {
		this.setState({selectedPublishType, scheduledDate});
	}


	onReset = async () => {
		const {assignment} = this.props;

		this.setState({loading: true});

		if(assignment.hasLink('Reset')) {
			await assignment.postToLink('Reset');
		}

		await assignment.refresh();

		this.setState({loading: false});
	}


	onDueDateChecked = (dueDateChecked) => {
		this.setState({dueDateChecked});
	}


	onDueDateChange = (dueDate) => {
		this.setState({dueDate});
	}


	onSave = async () => {
		const {assignment, onDismiss} = this.props;
		const {selectedPublishType, scheduledDate, dueDate, dueDateChecked} = this.state;

		this.setState({loading: true});

		if(assignment.hasLink('publish')) {
			await assignment.postToLink('publish');
		}

		const link = assignment.hasLink('date-edit') ? 'date-edit' : assignment.hasLink('edit') ? 'edit' : null;

		if(link) {
			await assignment.putToLink(link, {
				'available_for_submission_beginning': selectedPublishType === SCHEDULE ? scheduledDate.getTime() / 1000.0 : null,
				'available_for_submission_ending': dueDateChecked && dueDate.getTime() / 1000.0
			});
		}

		if(selectedPublishType === DRAFT) {
			await assignment.postToLink('unpublish');
		}

		this.setState({loading: false});

		if(onDismiss) {
			onDismiss();
		}
	}


	onCancel = () => {
		const {onDismiss} = this.props;

		if(onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {assignment} = this.props;
		const showReset = assignment.hasLink('Reset') || (!assignment.hasLink('date-edit-start'));

		return (
			<div className="assignment-inline-editor menu-container">
				<div className="assignment-due-date-editor">
					<div className="contents">
						<PublishState onPublishChange={this.onPublishChange} selectedType={this.state.selectedPublishType} scheduledDate={this.state.scheduledDate}/>
						{showReset && <Reset onReset={this.onReset}/>}
						<DueDate onDateChanged={this.onDueDateChange} date={this.state.dueDate} onDueDateChecked={this.onDueDateChecked} dueDateChecked={this.state.dueDateChecked}/>
					</div>
					<Footer onSave={this.onSave} onCancel={this.onCancel}/>
				</div>
			</div>
		);
	}
}
