import React from 'react';

import { Models } from '@nti/lib-interfaces';

import { Registry } from '../../../parts/Header';

Registry.register(
	Models.calendar.CalendarEventRef.MimeType,
	Object.assign(Heading, {
		applies: item => item.hasLink('check-in'), // || true
	})
);

export default function Heading(props) {
	return <div>Hi</div>;
}
