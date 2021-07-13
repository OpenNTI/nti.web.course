import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { DialogButtons, Prompt, Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { Event } from '@nti/web-calendar';
import { Connectors } from '@nti/lib-store';

const EventEditor = Event.editor;

import PositionSelect from '../../../common/PositionSelect';

const t = scoped('course.overview.lesson.items.event.common.Overview', {
	addToLesson: 'Add to Lesson',
	save: 'Save',
	cancel: 'Cancel',
	position: 'Position',
	areYouSure: 'Do you want to remove this event from the lesson?',
});

const Contents = styled(EventEditor.Contents)`
	max-height: calc(100vh - 215px);
`;

const Frame = styled(EventEditor.EditorFrame)`
	width: 810px;
`;

const Body = styled(EventEditor.Body)`
	width: 500px;
`;

class EventOverviewEditor extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		item: PropTypes.object,
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		event: PropTypes.object,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func,
		onDelete: PropTypes.func,
		createEvent: PropTypes.func,
		createError: PropTypes.string,
		saveDisabled: PropTypes.bool,
		saving: PropTypes.bool,
	};

	state = {};

	constructor(props) {
		super(props);

		const { event, overviewGroup } = props;

		this.state = {
			selectedSection: overviewGroup,
			selectedRank: (overviewGroup?.Items?.length ?? 0) + 1,
			...EventEditor.getStateFromEvent(event),
		};
	}

	onPositionChange = (selectedSection, selectedRank) => {
		this.setState({ selectedSection, selectedRank });
	};

	onDelete = () => {
		const { onDelete } = this.props;

		Prompt.areYouSure(t('areYouSure')).then(() => {
			onDelete();
		});
	};

	onCancel = () => {
		const { onCancel } = this.props;

		if (onCancel) {
			onCancel();
		}
	};

	onSave = async () => {
		const { onAddToLesson, course, event, createEvent } = this.props;
		const {
			selectedSection,
			selectedRank,
			title,
			description,
			location,
			startDate,
			endDate,
			imgBlob,
		} = this.state;

		const calendarEvent = await createEvent(
			course,
			event,
			title,
			description,
			location,
			startDate,
			endDate,
			imgBlob
		);

		if (calendarEvent) {
			onAddToLesson(
				selectedSection,
				selectedRank,
				imgBlob,
				calendarEvent
			);
		}
	};

	render() {
		const { saving, saveDisabled, onDelete, createError } = this.props;

		return (
			<Frame saving={saving || saveDisabled}>
				{createError && (
					<EventEditor.ErrorMessage>
						{createError}
					</EventEditor.ErrorMessage>
				)}
				{saving && <Loading.Mask />}
				<Contents>
					<EventEditor.Header
						dialog
						{...this.state}
						onDescriptionChange={val =>
							this.setState({ description: val })
						}
						onTitleChange={val => this.setState({ title: val })}
						onImageChange={imgBlob => this.setState({ imgBlob })}
					/>
					<Body
						{...this.props}
						{...this.state}
						onCalendarSelect={this.onCalendarSelect}
						onEndDateChange={x => this.setState({ endDate: x })}
						onLocationChange={val =>
							this.setState({ location: val })
						}
						onStartDateChange={x => this.setState({ startDate: x })}
						onDelete={onDelete && this.onDelete}
					>
						<PositionEditor
							{...this.props}
							{...this.state}
							onChange={this.onPositionChange}
						/>
					</Body>
				</Contents>
				<DialogButtons
					buttons={[
						{
							label: t('cancel'),
							onClick: this.onCancel,
						},
						{
							label: this.props.item
								? t('save')
								: t('addToLesson'),
							disabled: saveDisabled,
							onClick: this.onSave,
						},
					]}
				/>
			</Frame>
		);
	}
}

function PositionEditor({ item, lessonOverview, selectedSection, onChange }) {
	return (
		<div>
			<EventEditor.SectionTitle>{t('position')}</EventEditor.SectionTitle>
			<PositionSelect
				item={item}
				lessonOverview={lessonOverview}
				overviewGroup={selectedSection}
				onChange={onChange}
			/>
		</div>
	);
}

export default decorate(EventOverviewEditor, [
	Connectors.Any.connect(['createEvent', 'createError', 'saving']),
]);
