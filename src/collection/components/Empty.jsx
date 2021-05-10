import React from 'react';

import { scoped } from '@nti/lib-locale';
import { EmptyState, Theme } from '@nti/web-commons';

import { Store } from '../Store';

const t = scoped('course.collection.components.Empty', {
	AdministeredCourses: 'No Administered Courses',
	default: 'No Courses',
	search: {
		AdministeredCourses: 'No Matching Administered Courses',
		default: 'No Matching Courses',
	},
});

const EmptyCmp = styled(EmptyState)`
	color: white;
	opacity: 0.5;

	&.dark {
		color: var(--secondary-grey);
		opacity: 1;
	}
`;

export function Empty() {
	const { collection, searchTerm } = Store.useValue();

	const background = Theme.useThemeProperty('background');
	const lightBackground = background === 'light';
	const getKey = scope => `${searchTerm ? 'search.' : ''}${scope}`;

	let key = [collection?.Title, 'default']
		.map(getKey)
		.find(x => !t.isMissing(x));

	if (t.isMissing(key)) {
		return null;
	}

	return <EmptyCmp header={t(key)} dark={lightBackground} />;
}
