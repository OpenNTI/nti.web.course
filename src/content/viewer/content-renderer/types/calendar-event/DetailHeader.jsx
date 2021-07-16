import { Models } from '@nti/lib-interfaces';
import { Event } from '@nti/web-calendar';
import { isFlag } from '@nti/web-client';

import { Registry } from '../../../parts/Header';

Registry.register(
	item =>
		Models.calendar.CalendarEventRef.MimeType === item.MimeType &&
		item.CalendarEvent?.hasLink('list-attendance') &&
		isFlag('event-check-ins'),
	Event.DetailHeader
);

export default Event.DetailHeader;
