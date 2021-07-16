import React from 'react';
import PropTypes from 'prop-types';

import { Models } from '@nti/lib-interfaces';
import { Event } from '@nti/web-calendar';
import { isFlag } from '@nti/web-client';

import { Registry } from '../../../parts/Header';

//#region Registration & Meta

Registry.register(
	item =>
		Models.calendar.CalendarEventRef.MimeType === item.MimeType &&
		item.CalendarEvent?.hasLink('list-attendance') &&
		isFlag('event-check-ins'),
	Header
);

/**
 * @typedef HeadingProps
 * @property {Models.calendar.CalendarEventRef} item - Event Reference
 */
Header.propTypes = {
	item: PropTypes.instanceOf(Models.calendar.CalendarEventRef).isRequired,
};
//#endregion

/**
 * @param {HeadingProps} props
 * @returns {React.ReactElement}
 */
export default function Header({ item, className }) {
	const { CalendarEvent: event } = item;
	return <Event.DetailHeader {...{ event, className }} />;
}
