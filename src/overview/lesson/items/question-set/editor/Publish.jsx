import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Radio} from 'nti-web-commons';

import DateEditor from './DateEditor';

const DEFAULT_TEXT = {
	publish: 'Publish',
	schedule: 'Schedule',
	draft: 'Draft',
	publishDesc: 'Assignment is visible to students',
	scheduleDesc: 'When do you want students to have access to the assignment?',
	draftDesc: 'Currently not visible to any students'
};
const t = scoped('course.overview.lesson.items.questionset.editor.Publish', DEFAULT_TEXT);

export const PUBLISH = 'publish';
export const SCHEDULE = 'schedule';
export const DRAFT = 'draft';

export default class AssignmentEditorPublish extends React.Component {
	static propTypes = {
		onPublishChange: PropTypes.func,
		selectedType: PropTypes.oneOf([PUBLISH, SCHEDULE, DRAFT]),
		scheduledDate: PropTypes.object
	}

	constructor (props) {
		super(props);
	}


	state = {}


	onChange (newType, scheduledDate) {
		const {onPublishChange} = this.props;

		if(onPublishChange) {
			onPublishChange(newType, scheduledDate);
		}
	}


	selectPublish = () => {
		this.onChange(PUBLISH, this.props.scheduledDate);
	}


	selectSchedule = () => {
		this.onChange(SCHEDULE, this.props.scheduledDate || new Date());
	}


	selectDraft = () => {
		this.onChange(DRAFT, this.props.scheduledDate);
	}


	renderPublish () {
		const selected = this.props.selectedType === PUBLISH;

		return (
			<div className="publish-option">
				<div className="label schedule">
					<div className="nti-radio">
						<Radio name="assignment-publish-option-input" label={t(PUBLISH)} checked={selected} onChange={this.selectPublish}/>
					</div>
				</div>
				{selected && (
					<div className="publish-container container">
						<div className="publish-label">{t('publishDesc')}</div>
					</div>
				)}
			</div>
		);
	}


	onScheduledDateChanged = (newDate) => {
		this.onChange(this.props.selectedType, newDate);
	}


	renderSchedule () {
		const selected = this.props.selectedType === SCHEDULE;

		return (
			<div className="schedule-option">
				<div className="label schedule">
					<div className="nti-radio">
						<Radio name="assignment-publish-option-input" label={t(SCHEDULE)} checked={selected} onChange={this.selectSchedule}/>
					</div>
				</div>
				{selected && (
					<div className="schedule-container container">
						<div className="schedule-label">{t('scheduleDesc')}</div>
						<DateEditor date={this.props.scheduledDate} onDateChanged={this.onScheduledDateChanged}/>
					</div>
				)}
			</div>
		);
	}


	renderDraft () {
		const selected = this.props.selectedType === DRAFT;

		return (
			<div className="draft-option">
				<div className="label draft">
					<div className="nti-radio">
						<Radio name="assignment-publish-option-input" label={t(DRAFT)} checked={selected} onChange={this.selectDraft}/>
					</div>
				</div>
				{selected && (
					<div className="draft-container container">
						<div className="draft-label">{t('draftDesc')}</div>
					</div>
				)}
			</div>
		);
	}


	render () {
		return (
			<div className="inline-publish-editor">
				{this.renderPublish()}
				{this.renderSchedule()}
				{this.renderDraft()}
			</div>
		);
	}
}
