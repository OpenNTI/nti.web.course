import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
	DialogButtons,
	Prompt,
	Loading,
	useReducerState,
} from '@nti/web-commons';
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

EventOverviewEditor.propTypes = {
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

function EventOverviewEditor(props) {
	const {
		course,
		createEvent,
		createError,
		event,
		item,
		onAddToLesson,
		onCancel,
		onDelete,
		overviewGroup,
		saveDisabled,
		saving,
	} = props;

	const [state, setState, , change] = useReducerState({
		selectedSection: null,
		selectedRank: null,
		title: null,
		description: null,
		location: null,
		startDate: null,
		endDate: null,
		imgBlob: undefined,
	});

	useEffect(() => {
		setState({
			selectedSection: overviewGroup,
			selectedRank: (overviewGroup?.Items?.length ?? 0) + 1,
			mode: 'edit',
			...EventEditor.getStateFromEvent(event),
		});
	}, [event, overviewGroup]);

	const onSave = async () => {
		const calendarEvent = await createEvent(
			course,
			event,
			state.title,
			state.description,
			state.location,
			state.startDate,
			state.endDate,
			state.imgBlob
		);

		if (calendarEvent) {
			onAddToLesson(
				state.selectedSection,
				state.selectedRank,
				state.imgBlob,
				calendarEvent
			);
		}
	};

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
					{...state}
					onDescriptionChange={change('description')}
					onTitleChange={change('title')}
					onImageChange={change('imgBlob')}
				/>
				<Body
					{...props}
					{...state}
					onEndDateChange={change('endDate')}
					onLocationChange={change('location')}
					onStartDateChange={change('startDate')}
					onDelete={() =>
						Prompt.areYouSure(t('areYouSure')).then(onDelete)
					}
				>
					<PositionEditor
						{...props}
						{...state}
						onChange={change('selectedSection', 'selectedRank')}
					/>
				</Body>
			</Contents>
			<DialogButtons
				buttons={[
					{
						label: t('cancel'),
						onClick: onCancel,
					},
					{
						label: item ? t('save') : t('addToLesson'),
						disabled: saveDisabled,
						onClick: onSave,
					},
				]}
			/>
		</Frame>
	);
}

function PositionEditor({ item, lessonOverview, selectedSection, onChange }) {
	return (
		selectedSection && (
			<div>
				<EventEditor.SectionTitle>
					{t('position')}
				</EventEditor.SectionTitle>
				<PositionSelect
					item={item}
					lessonOverview={lessonOverview}
					overviewGroup={selectedSection}
					onChange={onChange}
				/>
			</div>
		)
	);
}

export default Connectors.Any.connect(['createEvent', 'createError', 'saving'])(
	EventOverviewEditor
);
