import React from 'react';
import PropTypes from 'prop-types';

import { Models } from '@nti/lib-interfaces';
import { Event } from '@nti/web-calendar';
import { Layouts } from '@nti/web-commons';

import TypeRegistry from '../Registry';

import Sidebar from './Sidebar';

const View = styled(Event.View)`
	& :global(.calendar-event-editor) {
		width: auto;
	}
`;

CourseContentViewerRendererCalendarEvent.propTypes = {
	location: PropTypes.shape({
		item: PropTypes.object,
	}),
	course: PropTypes.object.isRequired,
};

export default function CourseContentViewerRendererCalendarEvent({
	course,
	location,
}) {
	const { item: { CalendarEvent: event } = {} } = location || {};

	if (!event) {
		return null;
	}

	return (
		<>
			<Layouts.Aside component={Sidebar} course={course} />
			<View event={event} dialog={false} controls={false} />
		</>
	);
}

TypeRegistry.register(obj => {
	const { MimeType } = obj?.location?.item || {};
	return (
		MimeType &&
		Models.calendar.CalendarEventRef.MimeTypes.includes(MimeType)
	);
})(CourseContentViewerRendererCalendarEvent);
